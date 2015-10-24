var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our project model
var labelSchema = mongoose.Schema({


    _userid          : ObjectId,
    name             : String,
    color            : String

});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Label', labelSchema);