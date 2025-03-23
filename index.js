const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000; // Add a port number

const countFilePath = path.join(process.cwd(), 'api_count.txt');

async function initializeCount() {
  try {
    await fs.access(countFilePath);
  } catch (error) {
    await fs.writeFile(countFilePath, '0');
  }
}

initializeCount();

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const currentCount = parseInt(await fs.readFile(countFilePath, 'utf8'));
    res.send(`
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
    res.status(500).send('Internal server error.');
  }
});

app.post('/api/usage', async (req, res) => {
  try {
    const currentCount = parseInt(await fs.readFile(countFilePath, 'utf8'));
    const payloadCount = req.body.count || 1;

    if (typeof payloadCount !== 'number' || payloadCount < 0) {
      return res.status(400).json({ error: 'Invalid count in payload.' });
    }

    const newCount = currentCount + payloadCount;
    await fs.writeFile(countFilePath, newCount.toString());

    res.json({ message: 'Usage count updated successfully.', count: newCount });
  } catch (error) {
    console.error('Error updating usage count:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => { // Add app.listen() here.
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app; // Keep this line for Vercel