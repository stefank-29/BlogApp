const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/',
}); // facebook, github...

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    // from passport
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
