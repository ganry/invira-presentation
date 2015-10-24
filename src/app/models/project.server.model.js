var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our project model
var projectSchema = mongoose.Schema({


    _userid          : ObjectId,
    _labelid         : ObjectId,
    name             : String,
    slug             : String,
    description      : String,
    slidescontent    : String,
    creationdate     : { type: Date, default: Date.now },
    lastupdate       : { type: Date, default: Date.now },
    settings         : {
    }

});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);