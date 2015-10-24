module.exports = function(grunt) {

    // CONFIGURE GRUNT
    grunt.initConfig({

        // load our package.json so we can use things like name (pkg.name) and version
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            dev: {
                tasks: [
                    'nodemon', 'watch'
                    ],
                options: {
                    logConcurrentOutput: true
                }
            },
            production: {
                tasks: [
                    'jshint', 'uglify', 'copy', 'less', 'cssmin'
                ],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        nodemon: {
            dev: {
                script: 'dist/server.js',
                options: {
                    nodeArgs: ['--debug'],
                    env: {
                        PORT: '3000'
                    },
                    // omit this property if you aren't serving HTML files and
                    // don't want to open a browser tab on start
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('open')('http://localhost:3000');
                            }, 1000);
                        });

                        // refreshes browser when server reboots
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },
        // validate js files
        jshint: {
            options: {
                reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
            },

            // when this task is run, lint the Gruntfile and all js files in src
            build: ['Grunfile.js', 'src/app/**/*.js', 'src/config/**/*.js', 'src/public/js/editor/**/*.js', 'src/public/js/dashboard/**/*.js']
        },

        // minify js files
        uglify: {
            options: {
                banner: '/*\n Name: <%= pkg.name %>\n Date: <%= grunt.template.today("yyyy-mm-dd") %>\n Author: <%= pkg.author %>\n*/'
            },
            distBuild: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/app',
                        src: '**/*.js',
                        dest: 'dist/app'
                    },
                    {
                        expand: true,
                        cwd: 'src/config',
                        src: '**/*.js',
                        dest: 'dist/config'
                    },
                    {
                        //Server
                        'dist/server.js': 'src/server.js',

                        //Preview
                        'dist/public/js/editor/preview/preview.min.js': [
                            'src/public/js/editor/preview/preview.js',
                        ],

                        //landing
                        'dist/public/js/landing/app.js': [
                            'src/public/js/lib/jquery.tooltipster.js',
                            'src/public/js/lib/scrollReveal.js',
                            'src/public/js/landing/app.js',
                        ],

                        //dashboard
                        'dist/public/js/dashboard/app.js': [
                            //Libs
                            'src/public/js/lib/classie.js',
                            'src/public/js/lib/notificationFx.js',
                            'src/public/js/lib/jquery.tooltipster.js',
                            //views
                            'src/public/js/dashboard/views/new-presentation.js',

                            //helper
                            'src/public/js/dashboard/helper/requestHelper.js',
                            'src/public/js/dashboard/helper/formHelper.js',

                            //modules
                            'src/public/js/dashboard/modules/headerModule.js',
                            'src/public/js/dashboard/modules/noProjectAnimModule.js',
                            'src/public/js/dashboard/modules/searchInputModule.js',

                            //controller
                            'src/public/js/dashboard/controller/main.controller.js',
                            'src/public/js/dashboard/controller/user.controller.js',

                            'src/public/js/dashboard/login.js',
                            'src/public/js/dashboard/dashboard.js',
                            'src/public/js/dashboard/app.js'
                        ],

                        //Invira Editor
                        'dist/public/js/editor/editor.min.js': [
                            'src/public/js/editor/config.js',
                            'src/public/js/editor/modules/selectionDrawer.js',
                            'src/public/js/editor/editor.js',
                            'src/public/js/editor/modules/saveModule.js',
                            'src/public/js/editor/modules/notificationManager.js',
                            'src/public/js/editor/widgets/textWidgetManager.js',
                            'src/public/js/editor/widgets/codeWidgetManager.js',
                            'src/public/js/editor/widgets/widgetManager.js',
                            'src/public/js/editor/modules/editMenuModule.js',
                            'src/public/js/editor/modules/optionsToolbar.js',
                            'src/public/js/editor/modules/guiManager.js',
                            'src/public/js/editor/modules/dialogManager.js',
                            'src/public/js/editor/modules/userMenu.js',
                            'src/public/js/editor/app.js'
                        ],
                        //codemirror
                        'dist/public/js/lib/codemirror.min.js': [
                            'src/public/js/lib/codemirror/codemirror.js',
                            'src/public/js/lib/codemirror/addon/search/searchcursor.js',
                            'src/public/js/lib/codemirror/addon/search/search.js',
                            'src/public/js/lib/codemirror/addon/dialog/dialog.js',
                            'src/public/js/lib/codemirror/addon/edit/matchbrackets.js',
                            'src/public/js/lib/codemirror/addon/edit/closebrackets.js',
                            'src/public/js/lib/codemirror/addon/comment/comment.js',
                            'src/public/js/lib/codemirror/addon/wrap/hardwrap.js',
                            'src/public/js/lib/codemirror/addon/fold/foldcode.js',
                            'src/public/js/lib/codemirror/addon/fold/brace-fold.js',
                            'src/public/js/lib/codemirror/mode/xml/xml.js',
                            'src/public/js/lib/codemirror/mode/css/css.js',
                            'src/public/js/lib/codemirror/mode/javascript/javascript.js',
                            'src/public/js/lib/codemirror/mode/htmlmixed/htmlmixed.js'
                        ],

                        //Invira Lib
                        'dist/public/js/lib/invira/invira-lib.min.js': [
                            'src/public/js/lib/classie.js',
                            'src/public/js/lib/dialogFx.js',
                            'src/public/js/lib/notificationFx.js',
                            'src/public/js/lib/jquery.tooltipster.js',
                            'src/public/js/lib/jquery.colorPicker.js'
                        ],

                        //invira
                        'dist/public/js/lib/invira/invira.min.js': [
                            'src/public/js/lib/invira/head.min.js',
                            'src/public/js/lib/invira/invira.js'
                        ],

                        //Custom big libs
                        'dist/public/js/lib/jquery-1.11.2.min.js': 'src/public/js/lib/jquery-1.11.2.js',
                        'dist/public/js/lib/bootstrap.min.js': 'src/public/js/lib/bootstrap.js',
                        'dist/public/js/lib/modernizr.custom.min.js': 'src/public/js/lib/modernizr.custom.js',
                        'dist/public/js/lib/owl.carousel.js': 'src/public/js/lib/owl.carousel.js',

                        //Invira Plugins
                        'dist/public/js/lib/invira/plugin/highlight/highlight.js': 'src/public/js/lib/invira/plugin/highlight/highlight.js',
                        'dist/public/js/lib/invira/plugin/markdown/markdown.js': 'src/public/js/lib/invira/plugin/markdown/markdown.js',
                        'dist/public/js/lib/invira/plugin/markdown/marked.js': 'src/public/js/lib/invira/plugin/markdown/marked.js',
                        'dist/public/js/lib/invira/plugin/zoom-js/zoom.js': 'src/public/js/lib/invira/plugin/zoom-js/zoom.js',
                        'dist/public/js/lib/invira/plugin/notes/notes.js': 'src/public/js/lib/invira/plugin/notes/notes.js'
                    }
                ]
            }

        },

        // compile less stylesheets to css
        less: {
            build: {
                files: {
                    //Editor styles
                    'src/public/css/editor/style.css': [
                        'src/public/less/cssanimations.less',
                        'src/public/less/main-header.less',
                        'src/public/less/main-menu.less',
                        'src/public/less/input.less',
                        'src/public/less/editor/*.less'
                    ],
                    'src/public/css/editor/themes/default.css': 'src/public/less/editor/themes/default.less',
                    'src/public/css/editor/themes/defaultCode.css': 'src/public/less/editor/themes/defaultCode.less',
                    'src/public/css/editor/themes/defaultCodeEditor.css': 'src/public/less/editor/themes/defaultCodeEditor.less',

                    //landing styles
                    'src/public/css/landing/style.css': 'src/public/less/landing/*.less',

                    //dashboard styles
                    'src/public/css/dashboard/style.css': [
                        'src/public/less/cssanimations.less',
                        'src/public/less/main-header.less',
                        'src/public/less/main-menu.less',
                        'src/public/less/input.less',
                        'src/public/less/dashboard/*.less']
                }
            }
        },

        // configure cssmin to minify css files
        cssmin: {
            options: {
                banner: '/*\n Name: <%= pkg.name %>\n Date: <%= grunt.template.today("yyyy-mm-dd") %>\n Author: <%= pkg.author %>\n*/'
            },
            distBuild: {
                files: {
                    //Editor
                    'dist/public/css/editor/style.min.css': 'src/public/css/editor/style.css',
                    'dist/public/css/editor/themes/default.min.css': 'src/public/css/editor/themes/default.css',
                    'dist/public/css/editor/themes/defaultCode.min.css': 'src/public/css/editor/themes/defaultCode.css',
                    'dist/public/css/editor/themes/defaultCodeEditor.min.css': 'src/public/css/editor/themes/defaultCodeEditor.css',
                    'dist/public/css/slides.css': 'src/public/css/slides.css',
                    'dist/public/css/codemirror.css': 'src/public/css/codemirror.css',

                    //landing
                    'dist/public/css/landing/style.min.css': 'src/public/css/landing/style.css',

                    //home
                    'dist/public/css/dashboard/style.min.css': 'src/public/css/dashboard/style.css',
                    'dist/public/css/font-awesome.min.css': 'src/public/css/font-awesome.css',

                    //custom big libs
                    'dist/public/css/bootstrap.min.css': 'src/public/css/bootstrap.css',
                    'dist/public/css/owl.carousel.css': 'src/public/css/owl.carousel.css',
                    'dist/public/css/owl.theme.css': 'src/public/css/owl.theme.css',
                    'dist/public/css/animate.css': 'src/public/css/animate.css'
                }
            }
        },


        //DEV BUILD
        concat: {
            devJSBuild: {
                files: {
                    //Server
                    'dev/server.js': 'src/server.js',

                    //Preview
                    'dev/public/js/editor/preview/preview.min.js': [
                        'src/public/js/editor/preview/preview.js',
                    ],

                    //landing
                    'dev/public/js/landing/app.js': [
                        'src/public/js/lib/jquery.tooltipster.js',
                        'src/public/js/lib/scrollReveal.js',
                        'src/public/js/landing/app.js',
                    ],

                    //dashboard
                    'dev/public/js/dashboard/app.js': [
                        //Libs
                        'src/public/js/lib/classie.js',
                        'src/public/js/lib/notificationFx.js',
                        'src/public/js/lib/jquery.tooltipster.js',
                        //views
                        'src/public/js/dashboard/views/new-presentation.js',

                        //helper
                        'src/public/js/dashboard/helper/requestHelper.js',
                        'src/public/js/dashboard/helper/formHelper.js',
                        'src/public/js/dashboard/helper/dialogHelper.js',


                        //modules
                        'src/public/js/dashboard/modules/headerModule.js',
                        'src/public/js/dashboard/modules/noProjectAnimModule.js',
                        'src/public/js/dashboard/modules/searchInputModule.js',

                        //controller
                        'src/public/js/dashboard/controller/main.controller.js',
                        'src/public/js/dashboard/controller/user.controller.js',

                        'src/public/js/dashboard/login.js',
                        'src/public/js/dashboard/dashboard.js',
                        'src/public/js/dashboard/app.js'
                    ],

                    //Invira Editor
                    'dev/public/js/editor/editor.min.js': [
                        'src/public/js/editor/config.js',
                        'src/public/js/editor/modules/selectionDrawer.js',
                        'src/public/js/editor/editor.js',
                        'src/public/js/editor/modules/saveModule.js',
                        'src/public/js/editor/modules/notificationManager.js',
                        'src/public/js/editor/widgets/textWidgetManager.js',
                        'src/public/js/editor/widgets/codeWidgetManager.js',
                        'src/public/js/editor/widgets/widgetManager.js',
                        'src/public/js/editor/modules/editMenuModule.js',
                        'src/public/js/editor/modules/optionsToolbar.js',
                        'src/public/js/editor/modules/guiManager.js',
                        'src/public/js/editor/modules/dialogManager.js',
                        'src/public/js/editor/modules/userMenu.js',
                        'src/public/js/editor/app.js'
                    ],
                    //codemirror
                    'dev/public/js/lib/codemirror.min.js': [
                        'src/public/js/lib/codemirror/codemirror.js',
                        'src/public/js/lib/codemirror/addon/search/searchcursor.js',
                        'src/public/js/lib/codemirror/addon/search/search.js',
                        'src/public/js/lib/codemirror/addon/dialog/dialog.js',
                        'src/public/js/lib/codemirror/addon/edit/matchbrackets.js',
                        'src/public/js/lib/codemirror/addon/edit/closebrackets.js',
                        'src/public/js/lib/codemirror/addon/comment/comment.js',
                        'src/public/js/lib/codemirror/addon/wrap/hardwrap.js',
                        'src/public/js/lib/codemirror/addon/fold/foldcode.js',
                        'src/public/js/lib/codemirror/addon/fold/brace-fold.js',
                        'src/public/js/lib/codemirror/mode/xml/xml.js',
                        'src/public/js/lib/codemirror/mode/css/css.js',
                        'src/public/js/lib/codemirror/mode/javascript/javascript.js',
                        'src/public/js/lib/codemirror/mode/htmlmixed/htmlmixed.js'
                    ],

                    //Invira Lib
                    'dev/public/js/lib/invira/invira-lib.min.js': [
                        'src/public/js/lib/classie.js',
                        'src/public/js/lib/dialogFx.js',
                        'src/public/js/lib/notificationFx.js',
                        'src/public/js/lib/jquery.tooltipster.js',
                        'src/public/js/lib/jquery.colorPicker.js'
                    ],

                    //invira
                    'dev/public/js/lib/invira/invira.min.js': [
                        'src/public/js/lib/invira/head.min.js',
                        'src/public/js/lib/invira/invira.js'
                    ],

                    //Custom big libs
                    'dev/public/js/lib/jquery-1.11.2.min.js': 'src/public/js/lib/jquery-1.11.2.js',
                    'dev/public/js/lib/bootstrap.min.js': 'src/public/js/lib/bootstrap.js',
                    'dev/public/js/lib/modernizr.custom.min.js': 'src/public/js/lib/modernizr.custom.js',
                    'dev/public/js/lib/owl.carousel.js': 'src/public/js/lib/owl.carousel.js',

                    //Invira Plugins
                    'dev/public/js/lib/invira/plugin/highlight/highlight.js': 'src/public/js/lib/invira/plugin/highlight/highlight.js',
                    'dev/public/js/lib/invira/plugin/markdown/markdown.js': 'src/public/js/lib/invira/plugin/markdown/markdown.js',
                    'dev/public/js/lib/invira/plugin/markdown/marked.js': 'src/public/js/lib/invira/plugin/markdown/marked.js',
                    'dev/public/js/lib/invira/plugin/zoom-js/zoom.js': 'src/public/js/lib/invira/plugin/zoom-js/zoom.js',
                    'dev/public/js/lib/invira/plugin/notes/notes.js': 'src/public/js/lib/invira/plugin/notes/notes.js'
                }
            },
            //CSS
            devCSSBuild: {
                files: {
                    //Editor
                    'dev/public/css/editor/style.min.css': 'src/public/css/editor/style.css',
                    'dev/public/css/editor/themes/default.min.css': 'src/public/css/editor/themes/default.css',
                    'dev/public/css/editor/themes/defaultCode.min.css': 'src/public/css/editor/themes/defaultCode.css',
                    'dev/public/css/editor/themes/defaultCodeEditor.min.css': 'src/public/css/editor/themes/defaultCodeEditor.css',
                    'dev/public/css/slides.css': 'src/public/css/slides.css',
                    'dev/public/css/codemirror.css': 'src/public/css/codemirror.css',

                    //landing
                    'dev/public/css/landing/style.min.css': 'src/public/css/landing/style.css',

                    //home
                    'dev/public/css/dashboard/style.min.css': 'src/public/css/dashboard/style.css',
                    'dev/public/css/font-awesome.min.css': 'src/public/css/font-awesome.css',

                    //custom big libs
                    'dev/public/css/bootstrap.min.css': 'src/public/css/bootstrap.css',
                    'dev/public/css/owl.carousel.css': 'src/public/css/owl.carousel.css',
                    'dev/public/css/owl.theme.css': 'src/public/css/owl.theme.css',
                    'dev/public/css/animate.css': 'src/public/css/animate.css'
                }
            }
        },


        //dist & DEV BUILD
        copy: {
            dist: {
                files: [
                    //view templates
                    {expand: true, flatten: true, src: ['src/app/views/*.html'], dest: 'dist/app/views/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/editor/*.html'], dest: 'dist/app/views/editor/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/dashboard/*.html'], dest: 'dist/app/views/dashboard/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/dashboard/pages/*.html'], dest: 'dist/app/views/dashboard/pages/', filter: 'isFile'},

                    //partials
                    {expand: true, flatten: true, src: ['src/app/views/partials/*.html'], dest: 'dist/app/views/partials', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/partials/editor/*.html'], dest: 'dist/app/views/partials/editor/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/partials/editor/widgets/*.html'], dest: 'dist/app/views/partials/editor/widgets/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/partials/dashboard/*.html'], dest: 'dist/app/views/partials/dashboard/', filter: 'isFile'},

                    //other
                    {expand: true, flatten: true, src: ['src/public/images/*.*'], dest: 'dist/public/images/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/public/images/slides/*.*'], dest: 'dist/public/images/slides/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/public/images/landing/*.*'], dest: 'dist/public/images/landing/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/public/fonts/*.*'], dest: 'dist/public/fonts/', filter: 'isFile'}
                ]
            },
            dev: {
                files: [

                    //app folder
                    {expand: true, flatten: true, src: ['src/app/controllers/*.js'], dest: 'dev/app/controllers/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/helper/*.js'], dest: 'dev/app/helper/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/models/*.js'], dest: 'dev/app/models/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/routes/*.js'], dest: 'dev/app/routes/', filter: 'isFile'},

                    //config folder
                    {expand: true, flatten: true, src: ['src/config/*.js'], dest: 'dev/config/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/config/env/*.js'], dest: 'dev/config/env/', filter: 'isFile'},

                    //view templates
                    {expand: true, flatten: true, src: ['src/app/views/*.html'], dest: 'dev/app/views/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/editor/*.html'], dest: 'dev/app/views/editor/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/dashboard/*.html'], dest: 'dev/app/views/dashboard/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/dashboard/pages/*.html'], dest: 'dev/app/views/dashboard/pages/', filter: 'isFile'},

                    //partials
                    {expand: true, flatten: true, src: ['src/app/views/partials/*.html'], dest: 'dev/app/views/partials', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/partials/editor/*.html'], dest: 'dev/app/views/partials/editor/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/partials/editor/widgets/*.html'], dest: 'dev/app/views/partials/editor/widgets/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/app/views/partials/dashboard/*.html'], dest: 'dev/app/views/partials/dashboard/', filter: 'isFile'},

                    //other
                    {expand: true, flatten: true, src: ['src/public/images/*.*'], dest: 'dev/public/images/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/public/images/slides/*.*'], dest: 'dev/public/images/slides/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/public/images/landing/*.*'], dest: 'dev/public/images/landing/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['src/public/fonts/*.*'], dest: 'dev/public/fonts/', filter: 'isFile'}
                ]
            }
        },

        // configure watch to auto update
        watch: {

            server: {
                files: ['src/app/views/**/*.html'],
                tasks: ['copy:dev']
            },

            // for stylesheets, watch css and less files
            // only run less and cssmin
            stylesheets: {
                files: [
                    'src/public/css/**/*.css', 'src/public/less/**/*.less',
                ],
                tasks: ['less', 'concat:devCSSBuild']
            },

            // for scripts, run jshint and uglify
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat:devJSBuild', 'copy:dev']
            }
        }

    });

    // Load NPM tasks
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // CREATE TASKS
    //default task can be executed with just "grunt"
    grunt.registerTask('dist', ['jshint', 'uglify:distBuild', 'less', 'cssmin:distBuild', 'copy:dist']);
    grunt.registerTask('default', ['jshint', 'concat:devJSBuild', 'less', 'concat:devCSSBuild', 'copy:dev']);

    //start server and watch for changes
    grunt.registerTask('serve', ['concurrent:dev']);

};
