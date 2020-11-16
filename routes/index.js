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
router.post(
    '/add/:id',
    blogController.upload,
    catchErrors(blogController.resize),
    catchErrors(blogController.updateStore)
);

router.get('/blogs/:id/edit/', catchErrors(blogController.editBlog));

router.get('/blog/:slug', catchErrors(blogController.getBlogBySlug));

module.exports = router;
