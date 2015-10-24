module.exports = function(app) {
    var editor = require('../controllers/editor.server.controller');
    app.get('/editor', app.routesHelper.isAllowed, editor.get);
    app.get('/editor/set/:projectid', app.routesHelper.isAllowed, editor.setProject);
    app.get('/editor/preview', app.routesHelper.isAllowed, editor.getPreview);
    app.post('/editor/save/slides', app.routesHelper.isAllowed, editor.postSaveSlides);
};