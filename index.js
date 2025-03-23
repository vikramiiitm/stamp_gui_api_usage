const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();

const countFilePath = path.join(process.cwd(), 'api_count.txt');

async function initializeCount() {
  try {
    await fs.access(countFilePath);
  } catch (error) {
    await fs.writeFile(countFilePath, '0');
  }
}

initializeCount();

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

app.get('/api/usage', async (req, res) => {
  try {
    const currentCount = parseInt(await fs.readFile(countFilePath, 'utf8'));
    let increment = parseInt(req.query.count) || 1; // Get count from query param, default to 1

    if (typeof increment !== 'number' || isNaN(increment)) {
      return res.status(400).json({ error: 'Invalid count in query parameter.' });
    }

    const newCount = currentCount + increment;
    await fs.writeFile(countFilePath, newCount.toString());

    res.json({ message: 'Usage count updated successfully.', count: newCount });
  } catch (error) {
    console.error('Error updating usage count:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = app;