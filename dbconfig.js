// dbconfig.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// MySQL connection configuration using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,         // Use the DB_HOST environment variable
  user: process.env.DB_USER,         // Use the DB_USER environment variable
  password: process.env.DB_PASSWORD, // Use the DB_PASSWORD environment variable
  port: process.env.DB_PORT
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);  // Exit the application if the connection fails
  }
  console.log('Connected to MySQL');
});

module.exports = db;
