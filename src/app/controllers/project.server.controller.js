var Project       = require('../models/project.server.model');
var Label       = require('../models/label.server.model');

var customConfig = {
    colors: {
        color1: '#2ecc71',
        color2: '#3498db',
        color3: '#9b59b6',
        color4: '#e67e22',
        color5: '#f39c12'
    },
    colorsCount: 5,
    defaultColor: '#91c46b'
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {

    var randomColor = getRandomInt(1, customConfig.colorsCount)-1;
    var index = 0;

    console.log(randomColor);

    for (var key in customConfig.colors) {
        if (index == randomColor)
            return customConfig.colors[key];
        index++;
    }

    return customConfig.colors['defaultColor'];
}

function createLabel(req, name, done) {
    Label.findOne({'name': name, '_userid': req.user._id}, function(err, label) {
        if (err || !label) {
            // create new label and assign color
            var newLabel = new Label();
            newLabel.name = name;
            newLabel.color = getRandomColor();
            newLabel._userid = req.user._id;
            newLabel.save(function (err) {
                return done(err, newLabel);
            });
        } else {
            return done(err, label);
        }
    });
}

function error () {
    res.end('{"msg" : "Error!", "status" : "error"}');
}


module.exports = function() {

    exports.new = function (req, res) {

        var form = req.body;
        var project  = new Project();

        console.log(form);

        if (form.projectLabel !== '') {
            createLabel(req, form.projectLabel, function (err, label) {

                if (form.projectName !== '') {
                    project._userid = req.user._id;
                    project._labelid = label._id;
                    project.name = form.projectName;
                    project.description = form.projectDescription;
                    project.slidescontent = '<section id=\"slide\" class=\"\" style=\"display: block;\"><\/section>';

                    project.save(function (err) {
                        if (!err)
                            res.end('{"msg" : "Presentation created successfully!", "status" : 200, "projectId": "' + project._id + '", "labelid": "' + label._id + '"}');
                        else
                            error();
                    });
                } else
                    error();
            });
        } else
            error();
    };

    return exports;
};