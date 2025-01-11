const db = require('../dbconfig');
const { decodedUserid } = require('../utils/token');
const { DeleteFile } = require('../utils/fs');
const profile = async (req, res) => {
    try {
        const userid = decodedUserid(req, res);
        const [rows] = await db.promise().query('SELECT * FROM user WHERE id = ?', [userid]);

        if (rows.length > 0) {
            const imageUrl = `${req.protocol}://${req.get('host')}/userImg/${rows[0].image}`;
            rows[0].image = imageUrl;
            res.status(200).json({ user: rows[0], msg: "user found" }); // Send the first hotel object
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (err) {
        console.error('Error fetching hotel details:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const showAllAdmin = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM hotel where accept=0');

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
const AcceptHotel = async (req, res) => {
    try {
        const Hotelid = req.params.id;
        const [results] = await db.promise().execute('UPDATE hotel SET accept = 1 WHERE id = ?', [Hotelid]);
        if (!results) {
            return res.status(404).json({ message: "Failed Update Room" });
        }
        res.status(200).json({
            message: 'Update Hotel Successful',
        });
    }
    catch (err) {
        console.error('Error Update Hotel data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const showAll = async (req, res) => {
    try {
        const userid = decodedUserid(req, res);
        const [user] = await db.promise().query('SELECT * FROM user WHERE id = ?', [userid]);
        const [hotel] = await db.promise().query('SELECT * FROM hotel where id =? AND accept=1', [user[0].hotel_id]);
        const convertedHotel = {
            ...hotel[0],
            AC: hotel[0].AC === 1, // Convert AC from TINYINT to boolean
            Kategori: hotel[0].Kategori === 1, // Convert Kategori from TINYINT to boolean
            'Kolam Renang': hotel[0]['Kolam Renang'] === 1, // Convert Kolam Renang from TINYINT to boolean
            Lift: hotel[0].Lift === 1, // Convert Lift from TINYINT to boolean
            Parkir: hotel[0].Parkir === 1, // Convert Parkir from TINYINT to boolean
            'Resepsionis 24 Jam': hotel[0]['Resepsionis 24 Jam'] === 1, // Convert Resepsionis 24 Jam from TINYINT to boolean
            Restoran: hotel[0].Restoran === 1, // Convert Restoran from TINYINT to boolean
            Wifi: hotel[0].Wifi === 1, // Convert Wifi from TINYINT to boolean
            accept: hotel[0].accept === 1 // Convert accept from TINYINT to boolean
          };
        let rows = [];
        if (hotel.length > 0) {
            [rows] = await db.promise().query('SELECT * FROM room where hotel_id = ?', [user[0].hotel_id]);
            rows.forEach((hotel) => {
                if (hotel.image) {
                    const imgUrl = `${req.protocol}://${req.get('host')}/roomImg/${hotel.image}`;
                    hotel.image = imgUrl
                }
            })
            res.status(200).json({
                hotels:convertedHotel,
                rooms: rows,
                message: 'Room data retrieved successfully'
            });
        } else {
            res.status(404).json({ message: 'Please Wait Admin Check Your Data' });
        }
    } catch (err) {
        console.error('Error fetching hotel data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const createRoom = async (req, res) => {
    try {
        const userid = decodedUserid(req, res);
        const [user] = await db.promise().query('SELECT * FROM user WHERE id = ?', [userid]);
        const { roomtype, price } = req.body;
        const file = req.file ? req.file.filename : null;
        const [results] = await db.promise().execute('INSERT INTO room (room_type, price, hotel_id, image) VALUES (?, ?, ?, ?)', [roomtype, price, user[0].hotel_id, file]);
        if (!results) {
            return res.status(401).json({ message: "Failed Add Room" });
        }
        res.status(201).json({
            message: 'Add Room Successful',
        });
    } catch (err) {
        console.error('Error Add Room data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const updateRoom = async (req, res) => {
    try {
        const userid = decodedUserid(req, res);
        const roomid = req.params.id;
        const [user] = await db.promise().query('SELECT * FROM user WHERE id = ?', [userid]);
        const [room] = await db.promise().query('SELECT * FROM room WHERE id = ? AND hotel_id = ?', [roomid, user[0].hotel_id]);
        if (room[0].image) {
            DeleteFile(`./public/room/${room[0].image}`);
        }
        const { roomtype, price } = req.body;
        const file = req.file ? req.file.filename : null;
        let results;
        if (file === null) {
            [results] = await db.promise().execute('UPDATE room SET room_type = ?, price = ?, hotel_id = ? WHERE id = ?', [roomtype, price, user[0].hotel_id, roomid]);
        } else {
            [results] = await db.promise().execute('UPDATE room SET room_type = ?, price = ?, hotel_id = ?, image = ? WHERE id = ?', [roomtype, price, user[0].hotel_id, file, roomid]);
        }
        if (!results) {
            return res.status(404).json({ message: "Failed Update Room" });
        }
        res.status(200).json({
            message: 'Update Room Successful',
        });
    }
    catch (err) {
        console.error('Error Update Room data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
const deleteRoom = async (req, res) => {
    try {
        const userid = decodedUserid(req, res);
        const roomid = req.params.id;
        const [user] = await db.promise().query('SELECT * FROM user WHERE id = ?', [userid]);
        const [room] = await db.promise().query('SELECT * FROM room WHERE id = ? AND hotel_id = ?', [roomid, user[0].hotel_id]);
        if (room.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        } else {
            if (room[0].image) {
                DeleteFile(`./public/room/${room[0].image}`);
            }
            const [results] = await db.promise().execute('DELETE FROM room WHERE id = ? AND hotel_id = ?', [roomid, user[0].hotel_id]);
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Room not found' });
            }
            res.status(200).json({ message: 'Room deleted successfully' });
        }
    } catch (err) {
        console.error('Error deleting room:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports = { profile, showAll, createRoom, updateRoom, deleteRoom, showAllAdmin, AcceptHotel };