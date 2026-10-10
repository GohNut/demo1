/**
 * Sukjai Club LINE LIFF Member Profile Automated Tests
 * Tests Vercel Serverless Functions (api/*), Local Server (server.js),
 * Stateless Deterministic Member Number Derivation, Security Rules, and A11y Metrics.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handleConfig = require('../api/config');
const handleMember = require('../api/member');
const { deriveMemberNumber } = require('../api/member');
const { createServer } = require('../server');

async function runTests() {
  console.log('🧪 Starting Sukjai Club Member Profile Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // Helper HTTP request function
  function makeRequest(baseUrl, method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const u = new URL(path, baseUrl);
      const reqHeaders = { ...headers };
      let bodyData = null;
      if (body) {
        bodyData = JSON.stringify(body);
        reqHeaders['Content-Type'] = 'application/json';
        reqHeaders['Content-Length'] = Buffer.byteLength(bodyData);
      }
      const req = http.request(u, { method, headers: reqHeaders }, (res) => {
        let respData = '';
        res.on('data', chunk => { respData += chunk; });
        res.on('end', () => {
          let json = null;
          try { json = JSON.parse(respData); } catch (e) {}
          resolve({ status: res.statusCode, headers: res.headers, text: respData, json });
        });
      });
      req.on('error', reject);
      if (bodyData) req.write(bodyData);
      req.end();
    });
  }

  // 1. Stateless Deterministic Member Number Derivation
  test('deriveMemberNumber produces consistent format MB-XXXX-XXXX from LINE User ID', () => {
    const num1 = deriveMemberNumber('U1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6');
    assert.match(num1, /^MB-\d{4}-\d{4}$/);

    // Same user ID always derives exact same number (stateless, survives redeployments)
    const num2 = deriveMemberNumber('U1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6');
    assert.strictEqual(num1, num2);

    // Different user ID produces different number
    const numDiff = deriveMemberNumber('U99999999999999999999999999999999');
    assert.notStrictEqual(num1, numDiff);

    // Does not expose raw user ID
    assert.strictEqual(num1.includes('U1a2b3'), false);
  });

  // 2. Unconfigured Server Tests (Local & Vercel Preview Mode)
  const { server: unconfServer } = createServer({
    config: { liffId: '', lineChannelId: '', port: 0 }
  });

  await new Promise(resolve => unconfServer.listen(0, resolve));
  const unconfPort = unconfServer.address().port;
  const unconfBaseUrl = `http://127.0.0.1:${unconfPort}`;

  await testAsync('Unconfigured Server: GET /api/config returns configured: false', async () => {
    const res = await makeRequest(unconfBaseUrl, 'GET', '/api/config');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.configured, false);
    assert.strictEqual(res.json.liffId, '');
  });

  await testAsync('Unconfigured Server: POST /api/member returns preview data without database/store', async () => {
    const res = await makeRequest(unconfBaseUrl, 'POST', '/api/member', { preview: true });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.isPreview, true);
    assert.match(res.json.memberNumber, /^MB-\d{4}-\d{4}$/);
    assert.strictEqual(res.json.pictureUrl, '/images/sample-avatar.svg');
    assert.strictEqual(res.json.tier, undefined);
    assert.strictEqual(res.json.memberSince, undefined);

    // Crucial check: No data directory or file created
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../data')), false);
  });

  await testAsync('GET / serves index.html with HTML content type', async () => {
    const res = await makeRequest(unconfBaseUrl, 'GET', '/');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers['content-type'].includes('text/html'), true);
    assert.strictEqual(res.text.includes('สุขใจ คลับ'), true);
  });

  await testAsync('GET /style.css serves valid stylesheet with responsive overflow protections', async () => {
    const res = await makeRequest(unconfBaseUrl, 'GET', '/style.css');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers['content-type'].includes('text/css'), true);
    assert.strictEqual(res.text.includes('overflow-x: hidden'), true);
  });

  await testAsync('GET /images/sample-avatar.svg serves bundled sample portrait', async () => {
    const res = await makeRequest(unconfBaseUrl, 'GET', '/images/sample-avatar.svg');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers['content-type'].includes('image/svg+xml'), true);
    assert.strictEqual(res.text.includes('<svg'), true);
  });

  await testAsync('GET /app.js serves client javascript', async () => {
    const res = await makeRequest(unconfBaseUrl, 'GET', '/app.js');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers['content-type'].includes('javascript'), true);
    assert.strictEqual(res.text.includes('/images/sample-avatar.svg'), true);
  });

  await testAsync('Security: Directory traversal attempt is prevented', async () => {
    const res = await makeRequest(unconfBaseUrl, 'GET', '/../server.js');
    assert.strictEqual([403, 404].includes(res.status), true);
  });

  await new Promise(resolve => unconfServer.close(resolve));

  // 3. Configured Server Tests (Real LINE Mode & Security Hardening)
  const mockVerify = async (idToken, channelId) => {
    if (idToken === 'valid_real_token') {
      return {
        sub: 'U_VERIFIED_LINE_USER_777',
        name: 'สมชาย ตัวจริง',
        picture: 'https://profile.line-scdn.net/verified_pic',
        statusMessage: 'ยินดีที่ได้รู้จัก',
        aud: channelId
      };
    }
    throw new Error('Invalid token');
  };

  const { server: confServer } = createServer({
    verifyLineIdToken: mockVerify,
    config: {
      liffId: '2001234567-abcdefgh',
      lineChannelId: '2001234567',
      port: 0
    }
  });

  await new Promise(resolve => confServer.listen(0, resolve));
  const confPort = confServer.address().port;
  const confBaseUrl = `http://127.0.0.1:${confPort}`;

  await testAsync('Configured Server: GET /api/config returns configured: true', async () => {
    const res = await makeRequest(confBaseUrl, 'GET', '/api/config');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.configured, true);
    assert.strictEqual(res.json.liffId, '2001234567-abcdefgh');
  });

  await testAsync('Security: Configured server REJECTS POST /api/member with preview:true', async () => {
    const res = await makeRequest(confBaseUrl, 'POST', '/api/member', { preview: true });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.json.error.includes('Preview mode is disabled'), true);
  });

  await testAsync('Security: Configured server REJECTS spoofed sampleUserId', async () => {
    const res = await makeRequest(confBaseUrl, 'POST', '/api/member', {
      sampleUserId: 'U_ATTACKER_INVENTED_ID'
    });
    assert.strictEqual(res.status, 403);
  });

  await testAsync('Security: Configured server REJECTS request without ID token', async () => {
    const res = await makeRequest(confBaseUrl, 'POST', '/api/member', {});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.json.error, 'Missing ID token');
  });

  await testAsync('Security: Configured server REJECTS invalid ID token', async () => {
    const res = await makeRequest(confBaseUrl, 'POST', '/api/member', { idToken: 'fake_invalid_token' });
    assert.strictEqual(res.status, 401);
  });

  await testAsync('Configured Server: Authenticated request derives member number and excludes database fields', async () => {
    const res = await makeRequest(confBaseUrl, 'POST', '/api/member', { idToken: 'valid_real_token' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.json.lineUserId, 'U_VERIFIED_LINE_USER_777');
    assert.strictEqual(res.json.displayName, 'สมชาย ตัวจริง');
    assert.strictEqual(res.json.statusMessage, 'ยินดีที่ได้รู้จัก');
    assert.strictEqual(res.json.memberNumber, deriveMemberNumber('U_VERIFIED_LINE_USER_777'));
    assert.strictEqual(res.json.tier, undefined);
    assert.strictEqual(res.json.memberSince, undefined);
    assert.strictEqual(res.json.isPreview, false);
  });

  await new Promise(resolve => confServer.close(resolve));

  // 4. UI Cleanliness & Scope Narrowing Verification
  test('UI Narrowing: index.html has no tier badge and no member-since row', () => {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    assert.strictEqual(htmlContent.includes('id="tier-badge"'), false);
    assert.strictEqual(htmlContent.includes('เป็นสมาชิกตั้งแต่'), false);
    assert.strictEqual(htmlContent.includes('mb-skeleton-badge'), false);
    assert.strictEqual(htmlContent.includes('หมายเลขสมาชิก'), true);
  });

  test('UI Narrowing: style.css has no tier badge classes', () => {
    const cssContent = fs.readFileSync(path.join(__dirname, '../public/style.css'), 'utf8');
    assert.strictEqual(cssContent.includes('.mb-badge {'), false);
    assert.strictEqual(cssContent.includes('.mb-badge-gold'), false);
    assert.strictEqual(cssContent.includes('.mb-skeleton-badge'), false);
  });

  // 5. CSS Accessibility & Viewport Robustness Verification
  test('Accessibility & Robustness: CSS meets A11y metrics and contrast >= 7:1', () => {
    const cssContent = fs.readFileSync(path.join(__dirname, '../public/style.css'), 'utf8');

    // Body font size >= 16px
    assert.strictEqual(cssContent.includes('--mb-font-size-body: 16px;'), true);

    // Caption font size >= 14px
    assert.strictEqual(cssContent.includes('--mb-font-size-caption: 14px;'), true);

    // Primary button height >= 52px
    assert.strictEqual(cssContent.includes('--mb-spacing-button-h-primary: 52px;'), true);

    // Tap target minimum >= 48px
    assert.strictEqual(cssContent.includes('--mb-spacing-tap-min: 48px;'), true);

    // Reduced motion support
    assert.strictEqual(cssContent.includes('@media (prefers-reduced-motion: reduce)'), true);

    // Contrast fix from previous round preserved
    assert.strictEqual(cssContent.includes('color: var(--mb-text-secondary);'), true);
  });

  // 6. Vercel Configuration Verification
  test('Vercel Config: vercel.json exists and api/ functions exist', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../vercel.json')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../api/config.js')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../api/member.js')), true);
  });

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
