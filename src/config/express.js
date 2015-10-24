var config = require('./config');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var handlebars = require('express-handlebars');

module.exports = function () {

    // configuration ===============================================================
    mongoose.connect(config.db); // connect to our database

    require('./passport')(passport); // pass passport for configuration

    var app = express();
    var hbs = handlebars.create({
        layoutsDir: __dirname+'/../app/views',
        defaultLayout: 'main.html',
        partialsDir: __dirname+'/../app/views/partials',
        extname: '.html',
        // Specify helpers which are only registered on this instance.
        helpers: {
            modulo: function (options) {

                var index = options.data.index + 1,
                    nth = options.hash.nth;

                if (index % nth === 0) {
                    return options.fn(this);
                }
            }
        }
    });

    //helper
    app.routesHelper = require('../app/helper/routesHelper.js')();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));
    //app.use(bodyParser.json({ limit: '50mb' }));
    app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

    app.set('view cache', false);
    app.cache = false;

    // Tell express where it can find the templates
    app.set('views', __dirname + '/../app/views');

    app.engine('html', hbs.engine);
    app.set('view engine', '.html');

    //Tell express where it can find our static files
    app.use(express.static(__dirname+'/../public'));

    //register all routes
    //landing
    require('../app/routes/index.server.routes')(app);

    //login & signup
    require('../app/routes/authentication.server.routes')(app, passport);

    //dashboard
    require('../app/routes/dashboard.server.routes')(app);

    //editor
    require('../app/routes/editor.server.routes')(app);

    //content
    require('../app/routes/content.server.routes')(app);

    //project
    require('../app/routes/project.server.routes')(app);

    return app;
};