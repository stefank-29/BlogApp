const passport = require('passport');
const mongoose = require('mongoose');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/',
}); // facebook, github...

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};
