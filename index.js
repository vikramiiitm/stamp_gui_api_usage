const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

const countFilePath = path.join(process.cwd(), 'api_count.txt');

async function initializeCount() {
  try {
    await fs.access(countFilePath);
  } catch (error) {
    await fs.writeFile(countFilePath, '0');
  }
}

initializeCount();

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/') {
    try {
      const currentCount = parseInt(await fs.readFile(countFilePath, 'utf8'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>API Usage Count</title>
        </head>
        <body>
          <h1>Total API Usage Count: ${currentCount}</h1>
        </body>
        </html>
      `);
    } catch (error) {
      console.error('Error reading usage count:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error.');
    }
  } else if (pathname === '/api/usage' && req.method === 'GET') {
    try {
      const currentCount = parseInt(await fs.readFile(countFilePath, 'utf8'));
      let increment = parseInt(parsedUrl.query.count) || 1;

      if (typeof increment !== 'number' || isNaN(increment)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid count in query parameter.' }));
        return;
      }

      const newCount = currentCount + increment;
      await fs.writeFile(countFilePath, newCount.toString());

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Usage count updated successfully.', count: newCount }));
    } catch (error) {
      console.error('Error updating usage count:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3000; // Use environment variable for port, or default to 3000

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = server;