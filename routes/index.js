const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');
const { authenticate } = require('passport');

router.get('/', catchErrors(blogController.getBlogs));
router.get('/blogs', catchErrors(blogController.getBlogs));
router.get(
    '/myBlogs',
    authController.isLoggedIn,
    catchErrors(blogController.getUserBlogs)
);

router.get('/add', authController.isLoggedIn, blogController.addBlog);
router.post(
    '/add',
    blogController.upload,
    catchErrors(blogController.resize),
    catchErrors(blogController.createBlog)
);
router.post(
    '/add/:id',
    blogController.upload,
    catchErrors(blogController.resize),
    catchErrors(blogController.updateBlog)
);

router.get('/blogs/:id/edit/', catchErrors(blogController.editBlog));

router.get('/blog/:slug', catchErrors(blogController.getBlogBySlug));

// user routes
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

// 1. validate the registration data
// 2. register data
// 3. log user in
router.post(
    '/register',
    userController.validateRegister,
    userController.register,
    authController.login
);

router.get('/logout', authController.logout);

router.post('/login', authController.login);

router.get('/account', userController.account);
router.post('/account', catchErrors(userController.updateAccount));

module.exports = router;
