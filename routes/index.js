const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const blogController = require('../controllers/blogController');

router.get('/', blogController.homePage);

router.get('/add', blogController.addStore);

module.exports = router;
