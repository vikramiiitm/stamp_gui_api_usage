const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.send('Test API works');
});

module.exports = app;