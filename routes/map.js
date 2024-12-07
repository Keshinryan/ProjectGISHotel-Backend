const express = require('express');
const mapController= require('../controller/map')

const router = express.Router();

// Middleware to fetch hotel details
router.get('/all', mapController.showAll);

router.get('/detail/:id', mapController.detailId);

module.exports = router;