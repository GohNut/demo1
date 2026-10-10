/**
 * Sukjai Club LINE LIFF Member Profile Local Server
 * Node.js Native HTTP Server (No external dependencies)
 * Shares the exact same request handlers used in Vercel Serverless Functions (api/*)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const handleConfig = require('./api/config');
const handleMember = require('./api/member');
const { getConfig } = require('./api/config');
const { deriveMemberNumber } = require('./api/member');

const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function createServer(options = {}) {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Route to shared API handlers
    if (pathname === '/api/config') {
      return handleConfig(req, res, options);
    }

    if (pathname === '/api/member') {
      return handleMember(req, res, options);
    }

    // Static Asset Serving from public/
    if (req.method === 'GET' || req.method === 'HEAD') {
      let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
      if (safePath === '/' || safePath === '') {
        safePath = '/index.html';
      }

      const filePath = path.join(PUBLIC_DIR, safePath);

      // Security check: ensure path is inside PUBLIC_DIR
      if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Forbidden');
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Not Found');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': stats.size,
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
        });

        if (req.method === 'HEAD') {
          return res.end();
        }

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      });
      return;
    }

    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
  });

  return { server };
}

// Start server if executed directly
if (require.main === module) {
  const cfg = getConfig();
  const { server } = createServer();
  const PORT = cfg.port || 3000;
  server.listen(PORT, () => {
    console.log(`Sukjai Club Member Profile Server running on http://localhost:${PORT}`);
    console.log(`LIFF ID configured: ${cfg.liffId ? 'YES' : 'NO (Preview Mode active)'}`);
  });
}

module.exports = {
  createServer,
  loadConfig: getConfig,
  deriveMemberNumber
};
