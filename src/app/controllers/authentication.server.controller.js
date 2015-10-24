module.exports = function(passport) {

    exports.login = function (req, res) {

        if (req.isAuthenticated())
            res.redirect('/dashboard');
        else
            res.render('dashboard/login.html', {
                login: true,
                loginMessage: req.flash('loginMessage'),
                signupMessage: req.flash('signupMessage')
            });
    };

    exports.signup = function (req, res) {

        if (req.isAuthenticated())
            res.redirect('/dashboard');
        else
            res.render('dashboard/login.html', {
                signup: true,
                loginMessage: req.flash('loginMessage'),
                signupMessage: req.flash('signupMessage')
            });
    };

    exports.logout = function(req, res) {
        req.logout();
        res.redirect('/');
    };

    return exports;
};