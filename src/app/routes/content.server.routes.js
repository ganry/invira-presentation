module.exports = function(app) {
    var content = require('../controllers/content.server.controller')();
    app.post('/content/:contentname', app.routesHelper.isLoggedIn, content.contentGet);
};