const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
    res.send('Hey! It works!');
});

router.get('/reverse/:name', (req, res) => {
    res.send(req.params.name);
});

module.exports = router;
