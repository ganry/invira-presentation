var Project       = require('../models/project.server.model');

/**
 * getLastProject
 *
 * @param user the current logged in user
 * @param success Callback function if we find a project
 * @param error Callback function if there was an error
 *
 * @return returns the lastProject the user visited or if none exists, a random project
 */
function getLastProject(req, success, error) {

    var projectid = req.session.projectId || req.user.settings.lastProject || undefined;


    console.log('req.session.projectId: '+req.session.projectId);
    console.log('user.settings.lastProject: '+req.user.settings.lastProject);
    console.log('projectid: '+projectid);
    //has a last Project so we show it
    if (projectid != undefined) {
        // try to find the project based on their id
        Project.findOne({'_id': projectid, '_userid': req.user._id}, function (err, project) {

            if (err) {
                if (error !== undefined)
                    error();
            }

            if (project) {
                console.log('project.userid: ' + project._userid+ " s");
                console.log('user_id: ' + req.user._id+" t");
                console.log(project._userid == req.user._id);
                if ( success !== undefined) {
                    req.user.settings.lastProject = project._id;
                    req.user.save();

                    console.log('got a project, call success');
                    success(project);
                }
            } else if (error !== undefined)
                error();
        });
    } else {
        // try to find the project based on their id
        Project.findOne({'_userid': req.user._id}, function (err, project) {

            if (err) {
                if (error !== undefined)
                    error();
            }

            if (project) {
                req.user.settings.lastProject = project._id;
                req.user.save();

                if (success !== undefined)
                    success(project);
            }
        });
    }
}

function saveProject(req, slidescontent, projectid, success, error) {
    Project.findOne({'_id': projectid, '_userid': req.user._id}, function (err, project) {

        if (err) {
            if (error !== undefined)
                error();
        }

        if (project) {
            project.slidescontent = slidescontent;
            project.save();
            if (success !== undefined)
                success();
        } else if (error !== undefined)
            error();
    });
}

exports.postSaveSlides = function (req, res) {
    var projectId = req.session.projectId;
    var content = req.body;

    saveProject(req, content.slidescontent, projectId, function() {
        res.end('{"msg" : "Presentation saved successfully!", "status" : 200, "projectid": "'+projectId+'"}');
    }, function() {
        res.end('{"msg" : "Error!", "status" : "error"}');
    });
};

exports.setProject = function (req, res) {
    var projectId = req.params.projectid;
    req.session.projectId = projectId;

    res.redirect('/editor');
};

exports.get = function (req, res) {

    res.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');

    getLastProject(req, function(project) {
        req.session.projectId = project._id;
        res.render('editor/editor.html', {
            content: project.slidescontent,
            user: req.user,
            projectWidth: 960,
            projectHeight: 700
        });
    }, function() {
        res.redirect('/dashboard');
    });


    /*
    // var projectId = req.params.projectid;
    var projectId = '553fcc57e4b04c7f3dbff256';
    req.session.projectId = projectId;

    projects.findById(projectId, renderEditorProjectHtml);
    */
};


exports.getPreview = function (req, res) {

    res.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');

    getLastProject(req, function(project) {
        res.render('editor/preview.html', {
            content: project.slidescontent,
            projectWidth: 960,
            projectHeight: 700
        });
    }, function() {
        res.render('editor/editorError.html', {
            errorMsg: "Error"
        });
    });
    /*
    exports.res = res;

   // var projectId = req.params.projectid;
    var projectId = '553fcc57e4b04c7f3dbff256';
    req.session.projectId = projectId;

    projects.findById(projectId, renderPreviewProjectHtml);
    */
};