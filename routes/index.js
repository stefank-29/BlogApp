const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const blogController = require('../controllers/blogController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(blogController.getBlogs));
router.get('/blogs', catchErrors(blogController.getBlogs));

router.get('/add', blogController.addStore);
router.post(
    '/add',
    blogController.upload,
    catchErrors(blogController.resize),
    catchErrors(blogController.createStore)
);

module.exports = router;
