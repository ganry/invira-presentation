module.exports = function(app) {
    var dashboard = require('../controllers/dashboard.server.controller');
    app.get('/dashboard', app.routesHelper.isLoggedIn, dashboard.dashboard);
};