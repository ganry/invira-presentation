module.exports = function() {

    // route middleware to make sure a user is logged in
    exports.isLoggedIn = function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    };

    // route middleware to make sure a user is logged in
    exports.isAllowed = function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() && req.user.settings.betaChannel)
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/dashboard');
    };

    return exports;
};