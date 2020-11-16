const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name'); // from express validator (sanitize body)
    req.checkBody('name', 'You must enter a name!').notEmpty();
    req.checkBody('email', 'Email is not valid!').isEmail();
    // for different variations of email
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false,
    });
    req.checkBody('password', 'Password cannot be blank!').notEmpty();
    req.checkBody(
        'password-confirm',
        'Confirm Password cannot be blank!'
    ).notEmpty();
    req.checkBody('password-confirm', 'Your password do not match!').equals(
        req.body.password
    );
    const errors = req.validationErrors(); // check if there are errors above
    if (errors) {
        res.render('register', { title: 'Register', body: req.body });
        return;
    } else {
        next(); // no errors
    }
};

exports.register = async (req, res, next) => {
    const user = await new User({ email: req.body.email, name: req.body.name });
    const register = promisify(User.register, User); // pass method and object
    await register(user, req.body.password); // store passport as hash // from passport local (not Promise)
    next();
};
