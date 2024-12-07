const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./dbconfig');
const mapController = require('./routes/map'); // Import the map controller
require('./tbconfig');

const app = express();
const port = 3000;
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173']
  , // Allow requests from this origin
  credentials: true // Allow cookies to be sent in cross-origin requests
}));
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public/hotel' 1  directory
app.use('/hotelImg', express.static(__dirname + '/public/hotel'));

// Use the map controller middleware
app.use('/map', mapController);

app.use('/db/use', (req, res, next) => {
  db.query('USE hotel_db');
  res.status(200).json({ msg: "success to use hotels_db" });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});