const db = require('../dbconfig');

const showAll = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM hotel where accept=1');

    if (rows.length > 0) {
      rows.forEach((hotel) => {
        if (hotel.image) {
          const imgUrl = `${req.protocol}://${req.get('host')}/hotelImg/${hotel.image}`;
          hotel.image = imgUrl
        }
      })
      res.status(200).json({
        hotels: rows,
        message: 'Hotel data retrieved successfully'
      });
    } else {
      res.status(404).json({ message: 'No hotels found' });
    }
  } catch (err) {
    console.error('Error fetching hotel data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const showAllRoom= async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM room');

    if (rows.length > 0) {
      rows.forEach((hotel) => {
        if (hotel.image) {
          const imgUrl = `${req.protocol}://${req.get('host')}/roomImg/${hotel.image}`;
          hotel.image = imgUrl
        }
      })
      res.status(200).json({
        rooms: rows,
        message: 'Hotel data retrieved successfully'
      });
    } else {
      res.status(404).json({ message: 'No hotels found' });
    }
  } catch (err) {
    console.error('Error fetching hotel data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const detailId = async (req, res) => {
  try {

    const hotelId = req.params.id;
    const [rows] = await db.promise().query('SELECT * FROM hotel WHERE id = ?', [hotelId]);
    const [rooms] = await db.promise().query('SELECT * FROM room WHERE hotel_id = ?', [hotelId]);
    if (rows.length > 0) {
      const imageUrl = `${req.protocol}://${req.get('host')}/hotelImg/${rows[0].image}`;
      rows[0].image = imageUrl;
    }
    if (rooms.length > 0) {
      rooms.forEach((room) => {
        if (room.image) {
          const imgUrl = `${req.protocol}://${req.get('host')}/roomImg/${room.image}`;
          room.image = imgUrl
        }
      })
      rows[0].rooms = rooms;
      res.status(200).json({ hotel: rows[0], msg: "Hotel data found" }); // Send the first hotel object
    } else {
      res.status(404).json({ message: 'Hotel data not found' });
    }
  } catch (err) {
    console.error('Error fetching hotel details:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = { showAll, detailId, showAllRoom};