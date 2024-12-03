// tbconfig.js
const db = require('./dbconfig');

// Function to create database if it doesn't exist
const createDatabase = () => {
  db.query('CREATE DATABASE IF NOT EXISTS hotel_db', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      process.exit(1);
    }
    console.log('Database hotel_db is ready');
    db.query('USE hotel_db');
    createTable();  // After creating the database, create the table
  });
};


const createTable = () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS hotel (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hotel_name VARCHAR(255) NOT NULL,
        longitude DOUBLE NOT NULL,
        latitude DOUBLE NOT NULL,
        alamat TEXT NOT NULL,
        image VARCHAR(255)
      )
    `;
  
    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating hotel table:', err);
        process.exit(1);
      } else {
        console.log('Hotel table is ready or created');
  
        // Check if the 'id' and 'image' columns exist
        db.query('SHOW COLUMNS FROM hotel LIKE \'id\'', (err, results) => {
          if (err) {
            console.error('Error checking for id column:', err);
            process.exit(1);
          } else if (results.length === 0) {
            // Add 'id' and 'image' columns if they don't exist
            db.query('ALTER TABLE hotel ADD id INT AUTO_INCREMENT PRIMARY KEY FIRST', (err) => {
              if (err) {
                console.error('Error adding id column:', err);
                process.exit(1);
              }
            });
  
            db.query('ALTER TABLE hotel ADD image VARCHAR(255)', (err) => {
              if (err) {
                console.error('Error adding image column:', err);
                process.exit(1);
              }
            });
          }
          db.query('ALTER TABLE hotel MODIFY hotel_name VARCHAR(255) NOT NULL', (err) => {
            if (err) {
              console.error('Error modifying longitude column:', err);
              process.exit(1);
            }
          });
  
          // Modify the data types of 'longitude' and 'latitude'
          db.query('ALTER TABLE hotel MODIFY longitude DOUBLE NOT NULL', (err) => {
            if (err) {
              console.error('Error modifying longitude column:', err);
              process.exit(1);
            }
          });
  
          db.query('ALTER TABLE hotel MODIFY latitude DOUBLE NOT NULL', (err) => {
            if (err) {
              console.error('Error modifying latitude column:', err);
              process.exit(1);
            }
          });
          db.query('ALTER TABLE hotel MODIFY alamat TEXT NOT NULL', (err) => {
            if (err) {
              console.error('Error modifying alamat column:', err);
              process.exit(1);
            }
          });
        });
      }
    });
  };

// Check and create the database and table
createDatabase();
