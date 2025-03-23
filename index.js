const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Variable to store the total API count
let totalApiCount = 0;

// POST API to accept payload and increment the total API count
app.post('/api/count', (req, res) => {
    const { count } = req.body;
    if (typeof count === 'number') {
        totalApiCount += count;
        res.status(200).json({ message: 'Count updated successfully', totalApiCount });
    } else {
        res.status(400).json({ error: 'Invalid payload. Expected a number.' });
    }
});

// GET API to show the total API count usage in the browser
app.get('/', (req, res) => {
    // Send HTML response to display the total API count
    res.send(`
        <html>
            <head>
                <title>API Count Usage</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                    }
                    .count-container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .count {
                        font-size: 2em;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="count-container">
                    <h1>Total API Count Usage</h1>
                    <p class="count">${totalApiCount}</p>
                </div>
            </body>
        </html>
    `);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app for Vercel
module.exports = app;