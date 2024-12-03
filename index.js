// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./dbconfig');
require('./tbconfig');  // Ensure that the database and table are created when starting the server

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to get all hotels


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
