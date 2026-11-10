const http = require('http');
const fs = require('fs');
const path = require('path');

// NODE_PORT first so a sourced .env (where PORT is the Spring Boot port) does
// not move the static server onto the backend's port. PORT is honoured as a
// fallback because the test harness and the EADDRINUSE hint below both use it.
const PORT = process.env.NODE_PORT || process.env.PORT || 5000;
const ROOT_DIR = __dirname;
const ROOT_PREFIX = ROOT_DIR.endsWith(path.sep) ? ROOT_DIR : ROOT_DIR + path.sep;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.csv': 'text/csv; charset=UTF-8',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' http://localhost:* http://127.0.0.1:* https: wss:; frame-ancestors 'self';"
};

function serve404(res, safePath) {
  const notFoundPage = path.join(ROOT_DIR, '404.html');
  fs.readFile(notFoundPage, (err, content) => {
    if (!err && content) {
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        ...SECURITY_HEADERS
      });
      res.end(content);
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=UTF-8',
        ...SECURITY_HEADERS
      });
      res.end('404 Not Found: ' + safePath);
    }
  });
}

const server = http.createServer((req, res) => {
  // Normalize URL to remove query strings and leading slashes
  let parsedUrl;
  let safePath;

  try {
    // Decode the raw request path before URL normalization. URL() normalizes
    // encoded dot segments (/%2e%2e/) and would otherwise hide traversal.
    const rawPath = req.url.split('?')[0];
    safePath = decodeURIComponent(rawPath);
    parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=UTF-8', ...SECURITY_HEADERS });
    res.end('400 Bad Request');
    return;
  }

// Reverse proxy /api/v1 requests to Spring Boot backend (port 8085)
  if (safePath === '/api/v1' || safePath.startsWith('/api/v1/')) {
    const backendPort = process.env.BACKEND_PORT || 8085;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const backendReq = http.request({
      hostname: '127.0.0.1',
      port: backendPort,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `127.0.0.1:${backendPort}`,
        'x-forwarded-for': clientIp,
        'x-forwarded-proto': (req.connection && req.connection.encrypted) ? 'https' : 'http',
        'x-forwarded-host': req.headers.host || `localhost:${PORT}`
      }
    }, (backendRes) => {
      res.writeHead(backendRes.statusCode, backendRes.headers);
      backendRes.pipe(res);
    });

    backendReq.on('error', () => {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Backend service unavailable (offline fallback active)' }));
    });

    req.pipe(backendReq);
    return;
  }

  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  // Resolve from ROOT_DIR after decoding, while treating URL paths as relative.
  // This prevents encoded traversal such as /%2e%2e/server.js.
  const relativePath = safePath.replace(/^[/\\]+/, '');
  const filePath = path.resolve(ROOT_DIR, relativePath);

  // Security check: ensure path is strictly within ROOT_DIR
  if (filePath !== ROOT_DIR && !filePath.startsWith(ROOT_PREFIX)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('403 Forbidden');
    return;
  }

  // Security check: block internal files, backend code, config files, dotfiles, and build artifacts
  const normalizedRel = relativePath.replace(/\\/g, '/');
  const isForbiddenPath = 
    normalizedRel.startsWith('.') ||
    normalizedRel.startsWith('backend/') ||
    normalizedRel.startsWith('scripts/') ||
    normalizedRel.startsWith('tests/') ||
    normalizedRel.startsWith('docs/') ||
    normalizedRel.startsWith('keycloak/') ||
    ['server.js', 'package.json', 'package-lock.json', 'docker-compose.yml'].includes(normalizedRel.toLowerCase()) ||
    normalizedRel.endsWith('.md') ||
    normalizedRel.endsWith('.sh') ||
    normalizedRel.endsWith('.ps1') ||
    normalizedRel.endsWith('.py') ||
    normalizedRel.endsWith('.yml') ||
    normalizedRel.endsWith('.yaml');

  if (isForbiddenPath) {
    serve404(res, safePath);
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      serve404(res, safePath);
      return;
    }

    let actualFile = filePath;
    if (stats.isDirectory()) {
      if (!parsedUrl.pathname.endsWith('/')) {
        res.writeHead(301, { 'Location': parsedUrl.pathname + '/' + (parsedUrl.search || '') });
        res.end();
        return;
      }
      actualFile = path.join(filePath, 'index.html');
    }

    fs.stat(actualFile, (fileErr) => {
      if (fileErr) {
        serve404(res, safePath);
        return;
      }

      const ext = path.extname(actualFile).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(actualFile, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end('500 Internal Server Error: ' + readErr.message);
          return;
        }

        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          ...SECURITY_HEADERS
        });
        res.end(content);
      });
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`   To free port ${PORT} on Windows PowerShell, run:`);
    console.error(`     Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
    console.error(`   Or start on a different port:`);
    console.error(`     $env:PORT=5001; npm start\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🌾 Gramin Career Setu — Local Server Running`);
    console.log(`  Local URL:  http://localhost:${PORT}`);
    console.log(`  Index:      http://localhost:${PORT}/index.html`);
    console.log(`  Jobs:       http://localhost:${PORT}/jobs.html`);
    console.log(`  Resume:     http://localhost:${PORT}/resume.html`);
    console.log(`  Roadmap:    http://localhost:${PORT}/roadmap.html`);
    console.log(`======================================================\n`);
  });
}

module.exports = server;
