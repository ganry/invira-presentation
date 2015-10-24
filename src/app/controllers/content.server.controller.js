var Project       = require('../models/project.server.model');
var Label = require('../models/label.server.model');

function getProjectsFromUser(user, labelid, success, error) {
   var query =  Project.find({'_userid': user._id, '_labelid': labelid}).sort('-creationdate');

    query.exec(function (err, projects) {
        if (err) return error(err);
        if (success !== undefined) {
            success(projects);
        }
    });
}

function getLabelsFromUser(user, success, error) {
    var queryLabel = Label.find({'_userid': user._id}).sort('-creationdate');
    //var projectCountQuery = model.where({ 'color': 'black' }).count();

    queryLabel.exec(function (err, labels) {
        if (err) return error(err);
        if (success !== undefined) {
            success(labels);
        }
    });
}

module.exports = function() {

    exports.contentGet = function (req, res) {
        var templateName = req.params.contentname;

        if (templateName === 'main') {

            getLabelsFromUser(req.user, function (labels) {
                    res.render('dashboard/pages/' + templateName + '.html', {
                        layout: false,
                        user: req.user,
                        labels: labels
                    })
                }, function (err) {

                }
            );

        } else if (templateName === 'main-index-presentations') {

            var labelid = req.body.labelid;

            console.log(req.params);
            getProjectsFromUser(req.user, labelid, function (projects) {
                    res.render('dashboard/pages/' + templateName + '.html', {
                        layout: false,
                        user: req.user,
                        projects: projects
                    })
                }, function (err) {

                }
            );

        } else {

            res.render('dashboard/pages/' + templateName + '.html', {
                layout: false,
                user: req.user
            })
        }
    };

    return exports;
};