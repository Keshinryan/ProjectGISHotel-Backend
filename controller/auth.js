const db = require('../dbconfig');
const bcrypt = require('bcrypt');
const { generateToken,decodedUserid } = require('../utils/token');

login = async (req, res) => {
    try{       
        const { email, pass } = req.body;
        // Find user by email
        let [results] = await db.promise().execute('SELECT * FROM `user` WHERE `email` = ?', [email]);
        const user = results[0];
        // Authenticate the User Email
        if (!user) {
            return res.status(400).json([{ msg: "Incorrect Email or Password! Please Check Back Again.", path:"error" }]);
        }   
        //Authenticate the User Password 
        const passwordMatch = await bcrypt.compare(pass, user.pass);
        if (!passwordMatch) {
            return res.status(400).json([{ msg: "Incorrect Email or Password! Please Check Back Again.", path:"error" }]);
        }
        const {id} = results[0];
        const userToken={id};
        //Generate User Token
        const accessToken = generateToken(userToken);
        res.cookie('hotelgistoken', accessToken, { 
            httpOnly: false,
            secure: true, // Enable the Secure flag for HTTPS
            sameSite: 'None' // Set SameSite attribute to None for cross-origin requests
        });
        
        res.status(200).json({
            message: 'Login Successful',
            user:id,
        });
    }catch (error){
        res.status(404).json({
            message: "Failed to connect to Database",
            error:error.message
        })
    }
};

register = async (req, res) => {
    try {
        const { email, pass, hotelname, latitude, longitude, address } = req.body;
        const filehotel = req.files&&req.files['hotelimage'][0] ? req.files['hotelimage'][0].filename  : null;
        const fileuser= req.files&&req.files['userimage'][0] ? req.files['userimage'][0].filename  : null;
        const passhash = bcrypt.hashSync(pass, 10);

        // Check if the email is already used
        let [check] =await  db.promise().execute('SELECT * FROM `user` WHERE `email` = ?', [email]);
        if (check.length > 0) {
            return res.status(401).json({ message: "Email already used" });
        } else {
            // Insert into hotel table
            const [hotel] = await db.promise().execute('INSERT INTO `hotel` (`hotel_name`, `latitude`, `longitude`, `address`, `image`) VALUES (?, ?, ?, ?, ?, ?)', [hotelname, latitude, longitude, address, filehotel]);
            const hotelId = hotel.insertId;

            // Insert into user table
            const [results] = await db.promise().execute('INSERT INTO `user` (`email`, `pass`,`image`, `hotel_id`) VALUES (?, ?,?, ?)', [email, passhash, fileuser,hotelId]);
            if (!results) {
                return res.status(401).json({ message: "Failed Register" });
            }
            res.status(201).json({
                message: 'Register Successful',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to connect to Database",
            error: error.message
        });
    }
};
register2 = async (req, res) => {
    try {
        const { email, pass} = req.body;
        const hotelid=req.params.id;
        const fileuser= req.file ? req.file.filename  : null;
        const passhash = bcrypt.hashSync(pass, 10);

        // Check if the email is already used
        let [check] =await  db.promise().execute('SELECT * FROM `user` WHERE `email` = ?', [email]);
        if (check.length > 0) {
            return res.status(401).json({ message: "Email already used" });
        } else {
            // Insert into user table
            const [results] = await db.promise().execute('INSERT INTO `user` (`email`, `pass`,`image`, `hotel_id`) VALUES (?, ?,?, ?)', [email, passhash, fileuser,hotelid]);
            if (!results) {
                return res.status(401).json({ message: "Failed Register" });
            }
            res.status(201).json({
                message: 'Register Successful',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to connect to Database",
            error: error.message
        });
    }
};

logout = async(req,res)=>{
    try {
        res.clearCookie('hotelgistoken', { 
            httpOnly: true,
            secure: true, // Enable the Secure flag for HTTPS
            sameSite: 'None',
            maxAge: 0, // Set SameSite attribute to None for cross-origin requests
        });
        res.status(200).json({
            message: 'Logout Successful',
        });   
    } catch (error) {
        await db.promise().rollback();
        res.status(400).json({
            message: 'Logout Failed',
            error:error.message
        })
    }
}

module.exports = {
    login,
    register,
    register2,
    logout
};
