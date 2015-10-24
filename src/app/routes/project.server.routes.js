module.exports = function(app) {
    var project = require('../controllers/project.server.controller')(app);
    app.post('/project/new', project.new);
};