/* Import the required modules */
const { Router } = require('express');
const { profile, showAll, createRoom, updateRoom, deleteRoom, showAllAdmin,AcceptHotel } = require('../controller/user');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { validatorResult } = require('../utils/Validator');

const User = Router();

// Function to dynamically set destination path based on controller name
const dynamicDestination = function () {
    return function (req, file, callback) {
        const fileExt = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
        const uploadPath = 'public/room/';  // Example dynamic path
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
            const RoomType = req.body.roomtype || ''; // Get the user's email from the form data
            const sanitizedRoomType = RoomType.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Sanitize the username
            let filename = `${sanitizedRoomType}${fileExt}`;
            file.destination = 'public/room/';
            const directory = path.join(__dirname, '..', file.destination);
            const filePath = path.join(directory, filename);
            if (fs.existsSync(filePath)) {
                // If file exists, generte a unique name
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
User.get('/profile', profile);

User.get('/room', showAll);

User.get('/admin', showAllAdmin);

User.put('/admin/:id', upload().none(), conditionalValidation(), [
], AcceptHotel);

User.post('/room/add', upload().single('roomimage'), conditionalValidation(), [
    body('roomtype').isString().withMessage('Room Type is required'),
    body('price').isNumeric().withMessage('Price is required'),
], createRoom);

User.put('/room/update/:id', upload().single('roomimage'), conditionalValidation(), [
    body('roomtype').isString().withMessage('Room Type is required'),
    body('price').isNumeric().withMessage('Price is required'),
], updateRoom);

User.delete('/room/delete/:id', deleteRoom);
/* Export the router for use in other parts of the application */
module.exports = User;
