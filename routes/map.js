const express = require('express');
const mapController= require('../controller/map')

const router = express.Router();

// Middleware to fetch hotel details
router.get('/hotel', mapController.showAll);
router.get('/hotel/room', mapController.showAllRoom);

router.get('/hotel/:id', mapController.detailId);

module.exports = router;