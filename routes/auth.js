/* Import the required modules */
const { Router } = require('express');
const { login, register, logout, register2, registerAdmin } = require('../controller/auth');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { validatorResult } = require('../utils/Validator');

const Auth = Router();

// Function to dynamically set destination path based on controller name
const dynamicDestination = function () {
    return function (req, file, callback) {
        let uploadPath;
        if (file.fieldname === 'hotelimage') {
            uploadPath = `public/hotel/`;  // Example dynamic path
        } else if (file.fieldname === 'userimage') {
            uploadPath = `public/user/`;  // Example dynamic path
        } else {
            return callback(new Error('Invalid field name'));
        }
        // Create directory if it doesn't exist
        const directory = path.join(__dirname, '..', uploadPath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        callback(null, directory);
    };
};

// Multer disk storage configuration
const MulterStorage = function () {
    return multer.diskStorage({
        destination: dynamicDestination(),
        filename: function (req, file, callback) {
            const fileExt = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
            let filename;

            // Check fieldname and modify the filename accordingly
            if (file.fieldname === 'hotelimage') {
                const hotelName = req.body.hotelname || 'defaultHotel'; // Use hotelname from form data or a default name
                const sanitizedHotelName = hotelName.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Sanitize the hotel name
                filename = `${sanitizedHotelName}${fileExt}`;
                file.destination = 'public/hotel/';
            } else if (file.fieldname === 'userimage') {
                const userEmail = req.body.email || ''; // Get the user's email from the form data
                const userName = userEmail.split('@')[0]; // Extract the part before '@' as the username
                const sanitizedUserName = userName.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Sanitize the username
                filename = `${sanitizedUserName}${fileExt}`;
                file.destination = 'public/user/';
            } else {
                return callback(new Error('Invalid field name'));
            }
            // Check if the file already exists
            const directory = path.join(__dirname, '..', file.destination);
            const filePath = path.join(directory, filename);
            if (fs.existsSync(filePath)) {
                // If file exists, generate a unique name
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                filename = `${filename}-${uniqueSuffix}${fileExt}`;
            }
            callback(null, filename);
        }
    });
};

// Multer configuration
const upload = function () {
    return multer({
        storage: MulterStorage(),
        fileFilter: function (req, file, callback) {
            const fileName = file.originalname.toLowerCase();
            if (!fileName.match(/\.(jpg|jpeg|png)$/)) {
                return callback(new Error('Only Image Formats file are allowed!'));
            }
            callback(null, true);
        },
    });
};

const conditionalValidation = () => {
    return (req, res, next) => {
        if (!req.file) {
            validatorResult(req, res, next);
        } else {
            next();
        }
    };
};


Auth.route('/login').post(upload('').none(), [
    [
        [
            body("email").notEmpty().withMessage("Email required").isEmail().withMessage('Invalid Email format').normalizeEmail(),
            body("pass").notEmpty().withMessage("Password required").trim().escape(),
        ]

    ]
], conditionalValidation(), login); // Route for login
Auth.route('/register').post(upload().fields([{ name: 'hotelimage', maxCount: 1 },{ name: 'userimage', maxCount: 1 }]), [
    [
        [
            body("email").notEmpty().withMessage("Email required").isEmail().withMessage('Invalid Email format').normalizeEmail(),
            body("pass").notEmpty().withMessage("Password required").trim().escape(),
            body("hotelname").notEmpty().withMessage("Hotel Name required").trim().escape(),
            body("latitude").notEmpty().withMessage("Latitude required").isFloat().withMessage('Invalid Latitude'),
            body("longitude").notEmpty().withMessage("Longitude required").isFloat().withMessage('Invalid Longitude'),
            body("address").notEmpty().withMessage("Address required").trim().escape(),
        ]

    ]
], (req, res, next) => validatorResult(req, res, next), register); // Route for register
Auth.route('/register/admin').post(upload('').none(), [
    [
        [
            body("email").notEmpty().withMessage("Email required").isEmail().withMessage('Invalid Email format').normalizeEmail(),
            body("pass").notEmpty().withMessage("Password required").trim().escape(),
        ]

    ]
], (req, res, next) => validatorResult(req, res, next), registerAdmin); // Route for register

Auth.route('/register/:id').post(upload().single('userimage'), [
    [
        [
            body("email").notEmpty().withMessage("Email required").isEmail().withMessage('Invalid Email format').normalizeEmail(),
            body("pass").notEmpty().withMessage("Password required").trim().escape(),
        ]

    ]
], (req, res, next) => validatorResult(req, res, next), register2); // Route for register

Auth.get('/logout', logout);
/* Export the router for use in other parts of the application */
module.exports = Auth;
