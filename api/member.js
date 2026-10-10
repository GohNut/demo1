/**
 * POST /api/member
 * Vercel Serverless Function & Shared Request Handler
 * Computes deterministic member number from LINE User ID. Zero database/filesystem persistence.
 */

const crypto = require('crypto');
const { getConfig } = require('./config');

/**
 * Derives a consistent, deterministic member number from the LINE User ID.
 * Uses SHA-256 one-way hashing; maps to 8 decimal digits formatted as MB-XXXX-XXXX.
 * Space: 10^8 (100,000,000) possibilities.
 */
function deriveMemberNumber(lineUserId) {
  if (!lineUserId) return 'MB-0000-0000';
  const hash = crypto.createHash('sha256').update(String(lineUserId)).digest();
  const num = Number(hash.readBigUInt64BE(0) % 100000000n);
  const part1 = String(Math.floor(num / 10000)).padStart(4, '0');
  const part2 = String(num % 10000).padStart(4, '0');
  return `MB-${part1}-${part2}`;
}

async function defaultVerifyLineIdToken(idToken, channelId) {
  if (!idToken) throw new Error('Missing ID token');
  if (!channelId) throw new Error('Missing LINE Channel ID on server');

  const params = new URLSearchParams();
  params.append('id_token', idToken);
  params.append('client_id', channelId);

  const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LINE token verification failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      return Promise.resolve({});
    }
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Request entity too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.writeHead(statusCode);
  res.end(JSON.stringify(data));
}

async function handleMember(req, res, options = {}) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const cfg = options.config ? { ...getConfig(), ...options.config } : getConfig();
  const verifyTokenFn = options.verifyLineIdToken || defaultVerifyLineIdToken;

  const isConfigured = Boolean(
    cfg.liffId &&
    cfg.liffId.trim() !== '' &&
    cfg.liffId !== 'YOUR_LIFF_ID'
  );

  try {
    const body = await parseBody(req);

    // Unconfigured server / deployment: return labelled in-memory preview data
    if (!isConfigured) {
      const sampleUserId = 'U1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6';
      return sendJson(res, 200, {
        lineUserId: sampleUserId,
        memberNumber: deriveMemberNumber(sampleUserId),
        displayName: 'สมชาย ใจดี',
        pictureUrl: '/images/sample-avatar.svg',
        statusMessage: 'สุขใจทุกวันที่ได้พบกัน',
        isPreview: true
      });
    }

    // Configured server / deployment: strictly forbid preview or client-supplied IDs
    if (body.preview === true || body.sampleUserId) {
      return sendJson(res, 403, {
        error: 'Forbidden: Preview mode is disabled when LIFF ID is configured'
      });
    }

    // Real LINE authenticated flow
    const idToken = body.idToken;
    if (!idToken) {
      return sendJson(res, 400, { error: 'Missing ID token' });
    }

    let linePayload;
    try {
      linePayload = await verifyTokenFn(idToken, cfg.lineChannelId);
    } catch (verifyErr) {
      return sendJson(res, 401, {
        error: 'Authentication failed',
        details: verifyErr.message
      });
    }

    const lineUserId = linePayload.sub;
    if (!lineUserId) {
      return sendJson(res, 401, { error: 'Invalid token subject' });
    }

    // Derive member number deterministically from verified LINE user ID (stateless)
    const memberNumber = deriveMemberNumber(lineUserId);

    return sendJson(res, 200, {
      memberNumber,
      lineUserId,
      displayName: linePayload.name || '',
      pictureUrl: linePayload.picture || '',
      statusMessage: linePayload.statusMessage || '',
      isPreview: false
    });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
}

module.exports = handleMember;
module.exports.deriveMemberNumber = deriveMemberNumber;
module.exports.verifyLineIdToken = defaultVerifyLineIdToken;
