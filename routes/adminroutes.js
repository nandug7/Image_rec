const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admincontroller');



router.get('/dash', adminController.adminDashboard);

module.exports = router;