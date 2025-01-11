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
    createHotelTable();  // After creating the database, create the table
  });
};


const createHotelTable = () => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS hotel (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hotel_name VARCHAR(255) NOT NULL,
        longitude DOUBLE NOT NULL,
        latitude DOUBLE NOT NULL,
        address TEXT NOT NULL,
        image VARCHAR(255)
      )
    `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating hotel table:', err);
      process.exit(1);
    } else {
      console.log('Hotel table is ready or created');

      // Check if the 'id' and 'rating' columns exist
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
        }

        db.query('SHOW COLUMNS FROM hotel LIKE \'accept\'', (err, results) => {
          if (err) {
            console.error('Error checking for accept column:', err);
            process.exit(1);
          } else if (results.length === 0) {
            // Add 'accept' column if it doesn't exist
            db.query('ALTER TABLE hotel ADD accept BOOLEAN DEFAULT FALSE NOT NULL AFTER address', (err) => {
              if (err) {
                console.error('Error adding accept column:', err);
                process.exit(1);
              } else {
                console.log('Accept column added with default value FALSE');
              }
            });
          }
        });
        // Check if the 'rating' column exists
        db.query('SHOW COLUMNS FROM hotel LIKE \'rating\'', (err, results) => {
          if (err) {
            console.error('Error checking for rating column:', err);
            process.exit(1);
          } else if (results.length === 0) {
            // Add 'rating' column if it doesn't exist
            db.query('ALTER TABLE hotel ADD rating DOUBLE DEFAULT 5.0', (err) => {
              if (err) {
                console.error('Error adding rating column:', err);
                process.exit(1);
              } else {
                console.log('Rating column added with default value 5.0');
              }
            });
          }
        });

        db.query('ALTER TABLE hotel MODIFY hotel_name VARCHAR(255) NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying longitude column:', err);
            process.exit(1);
          }
        });
        db.query('ALTER TABLE hotel MODIFY `Kategori` ENUM("Hotel", "Wisma","Homestay","Guest House") DEFAULT "Hotel" NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying Kategori column:', err);
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
        db.query('ALTER TABLE hotel MODIFY address TEXT NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying address column:', err);
            process.exit(1);
          }
        });

        db.query('ALTER TABLE hotel MODIFY image VARCHAR(255)', (err) => {
          if (err) {
            console.error('Error modifying image column:', err);
            process.exit(1);
          }
        });
        db.query('ALTER TABLE hotel MODIFY AC BOOLEAN DEFAULT FALSE NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying AC column:', err);
            process.exit(1);
          }
        });
        db.query('ALTER TABLE hotel MODIFY Restoran BOOLEAN DEFAULT FALSE NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying Restoran column:', err);
            process.exit(1);
          }
        });
        db.query('ALTER TABLE hotel MODIFY Wifi BOOLEAN DEFAULT FALSE NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying Wifi column:', err);
            process.exit(1);
          }
        });
        db.query('ALTER TABLE hotel MODIFY `Resepsionis 24 Jam` BOOLEAN DEFAULT FALSE NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying Resepsionis 24 Jam column:', err);
            process.exit(1);
          }
        });
        db.query('ALTER TABLE hotel MODIFY Parkir BOOLEAN DEFAULT FALSE NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying parkir column:', err);
            process.exit(1);
          }
        });
        db.query('ALTER TABLE hotel MODIFY Lift BOOLEAN DEFAULT FALSE NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying Lift column:', err);
            process.exit(1);
          }
        });
        db.query('ALTER TABLE hotel MODIFY `Kolam Renang` BOOLEAN DEFAULT FALSE NOT NULL', (err) => {
          if (err) {
            console.error('Error modifying Kolam Renang column:', err);
            process.exit(1);
          }
        });
      });
    }
  });
  createUserTable();
  CreateRoomTable();
};
const createUserTable = () => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    hotel_id INT,
    FOREIGN KEY (hotel_id) REFERENCES hotel(id) 
  )
`;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating user table:', err);
      process.exit(1);
    } else {
      console.log('User table is ready or created');
      // Check if the 'role' column exists in the 'user' table
      db.query('SHOW COLUMNS FROM user LIKE \'role\'', (err, results) => {
        if (err) {
          console.error('Error checking for role column:', err);
          process.exit(1);
        } else if (results.length === 0) {
          // Add 'role' column if it doesn't exist
          db.query('ALTER TABLE user ADD role ENUM("admin", "user") DEFAULT "user" NOT NULL AFTER pass', (err) => {
            if (err) {
              console.error('Error adding role column:', err);
              process.exit(1);
            } else {
              console.log('Role column added with default value "user"');
            }
          });
        }
      });
    }
  });
}

const CreateRoomTable = () => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_type VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    image VARCHAR(255),
    hotel_id INT NOT NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotel(id) 
  )
`;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating room table:', err);
      process.exit(1);
    } else {
      console.log('Room table is ready or created');
    }
  });

  db.query('ALTER TABLE room MODIFY room_type VARCHAR(255) NOT NULL', (err) => {
    if (err) {
      console.error('Error modifying room_type column:', err);
      process.exit(1);
    }
  });

  db.query('ALTER TABLE room MODIFY price INT NOT NULL', (err) => {
    if (err) {
      console.error('Error modifying price column:', err);
      process.exit(1);
    }
  });

  db.query("SHOW COLUMNS FROM room LIKE 'id'", (err, result) => {
    if (err) {
      console.error('Error checking id column:', err);
      process.exit(1);
    }
    if (result.length === 0) {
      db.query('ALTER TABLE room ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY  FIRST', (err) => {
        if (err) {
          console.error('Error adding id column:', err);
          process.exit(1);
        }
      });
    }
  });
  db.query("SHOW COLUMNS FROM room LIKE 'image'", (err, result) => {
    if (err) {
      console.error('Error checking image column:', err);
      process.exit(1);
    }
    if (result.length === 0) {
      db.query('ALTER TABLE room ADD COLUMN image VARCHAR(255) AFTER `price`', (err) => {
        if (err) {
          console.error('Error adding image column:', err);
          process.exit(1);
        }
      });
    }
  });

  // Check if the hotel_id column exists before modifying it
  db.query("SHOW COLUMNS FROM room LIKE 'hotel_id'", (err, result) => {
    if (err) {
      console.error('Error checking hotel_id column:', err);
      process.exit(1);
    }
    if (result.length > 0) {
      db.query('ALTER TABLE room MODIFY COLUMN hotel_id INT NOT NULL, ADD FOREIGN KEY (hotel_id) REFERENCES hotel(id)', (err) => {
        if (err) {
          console.error('Error modifying hotel_id column or adding foreign key:', err);
          process.exit(1);
        }
      });
    } else {
      db.query('ALTER TABLE room ADD COLUMN hotel_id INT NOT NULL, ADD FOREIGN KEY (hotel_id) REFERENCES hotel(id)', (err) => {
        if (err) {
          console.error('Error adding hotel_id column or foreign key:', err);
          process.exit(1);
        }
      });
    }
  });
}

// Check and create the database and table
createDatabase();
