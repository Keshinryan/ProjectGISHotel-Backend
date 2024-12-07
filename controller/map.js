const db = require('../dbconfig');

const showAll = async (req, res) => {
    try {
      await db.promise().query('use hotel_db');
      const [rows] = await db.promise().query('SELECT * FROM hotel');
  
      if (rows.length > 0) {
        rows.forEach((hotel)=>{
            if(hotel.image){
                const imgUrl= `${req.protocol}://${req.get('host')}/hotelImg/${hotel.image}`;
                hotel.image= imgUrl
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

  const detailId = async (req, res) => {
    try {
      await db.promise().query('use hotel_db')
      //  if you've already established the connection elsewhere
  
      const hotelId = req.params.id;
      const [rows] = await db.promise().query('SELECT * FROM hotel WHERE id = ?', [hotelId]);
  
      if (rows.length > 0) {
        const imageUrl = `${req.protocol}://${req.get('host')}/hotelImg/${rows[0].image}`;
        rows[0].image = imageUrl;
        res.status(200).json({hotel:rows[0], msg:"Hotel found"}); // Send the first hotel object
      } else {
        res.status(404).json({ message: 'Hotel not found' });
      }
    } catch (err) {
      console.error('Error fetching hotel details:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
module.exports = {showAll,detailId};