/**
 * GET /api/config
 * Vercel Serverless Function & Shared Request Handler
 * Returns LIFF configuration status based on environment variables or config.json
 */

const fs = require('fs');
const path = require('path');

function getConfig() {
  let cfg = { liffId: '', lineChannelId: '', port: 3000 };
  const configPath = path.join(process.cwd(), 'config.json');
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      cfg = { ...cfg, ...JSON.parse(content) };
    }
  } catch {}

  // Environment variables override (Vercel & production standard)
  if (process.env.LIFF_ID) cfg.liffId = process.env.LIFF_ID;
  if (process.env.LINE_CHANNEL_ID) cfg.lineChannelId = process.env.LINE_CHANNEL_ID;
  if (process.env.PORT) cfg.port = parseInt(process.env.PORT, 10) || cfg.port;

  return cfg;
}

function handleConfig(req, res, options = {}) {
  const cfg = options.config ? { ...getConfig(), ...options.config } : getConfig();
  const isConfigured = Boolean(
    cfg.liffId &&
    cfg.liffId.trim() !== '' &&
    cfg.liffId !== 'YOUR_LIFF_ID'
  );

  const data = {
    liffId: cfg.liffId || '',
    configured: isConfigured
  };

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(data);
  }
  res.writeHead(200);
  res.end(JSON.stringify(data));
}

module.exports = handleConfig;
module.exports.getConfig = getConfig;
