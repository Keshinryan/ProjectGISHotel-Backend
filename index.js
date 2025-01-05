const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./dbconfig');
const { CheckToken } = require('./utils/token');
const mapController = require('./routes/map'); // Import the map controller
const Auth = require('./routes/auth');
const User = require('./routes/user');
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
app.use('/userImg', CheckToken,express.static(__dirname + '/public/user'));
app.use('/roomImg', express.static(__dirname + '/public/room'));

// Use the map controller middleware
app.use('/map', mapController);
app.use('/auth', Auth);
app.use('/user', CheckToken,User);
app.use('/db/use', (req, res, next) => {
  db.query('USE hotel_db');
  res.status(200).json({ msg: "success to use hotels_db" });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});