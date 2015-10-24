/*
 * newPresentation.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function NewPresentation(dashboard) {
    var $this = this;

    this.dashboard = dashboard;

    this.resetElement = function(el, statusIcon) {
        statusIcon.addClass("icon-check");
        statusIcon.toggleClass("icon-close", "icon-check");
        el.removeClass("error-placeholder");
        el.removeClass("error-input");
        el.off('change');
    };

    this.markInput = function(el, statusIcon) {
        statusIcon.removeClass("icon-check");
        statusIcon.addClass("icon-close");
        el.addClass("error-placeholder");
        el.addClass("error-input");
    };

    this.validateForm = function(el, event) {
        var statusIcon = undefined;
        var err = false;

        $('[data-required-field]').each(function(index) {

                console.log($(this));

                if ($(this).val() == '') {
                    err = true;
                    statusIcon = $(this).siblings('.status-icon').eq(0);
                    $(this).on('change', function(e) {
                        if ($(this).val() !== '') {
                            $this.resetElement($(this), statusIcon);
                        }
                    });
                    $this.markInput($(this), statusIcon);

                } else {
                    $this.resetElement($(this), statusIcon);
                }
        });

        return err;
    };

    this.init = function() {
        $('#cancel-new-project').on('click', function(e) {
            $this.dashboard.changePageByName('main');
            e.preventDefault();
            return false;
        });

        $this.dashboard.app.formHelper.init($('#new-project-form'), function(e) {
            //All Inputs are valid and we can create a new project
            $this.dashboard.app.requestHelper.postContent('/project/new', $('#new-project-form').serialize(), function(result) {

                $('.container-fluid.dashboard').html(
                    '<div class="row">' +
                    '<div class="project-created-successful" style="display: none;">'+
                    '<i class="fa fa-5x fa-cloud-upload"></i>' +
                    '<h3>Project creation successful!</h3>' +
                    '</div>' +
                    '</div>'
                );
                $('.project-created-successful').fadeIn('fast', function() {
                    var jsonResult = JSON.parse(result);

                    setTimeout(function() {
                        $this.dashboard.changePageByName('main', 'index-presentations', {labelid: jsonResult.labelid});
                        /*
                        $this.dashboard.changePage('labelid')
                        console.log('/editor/set/'+jsonResult.projectId);
                        window.location.replace('/editor/set/'+jsonResult.projectId);
                        */
                    }, 1200);

                });

                console.log("succes");
                console.log(result);

            }, function(result) {
                console.log("error");
                console.log(result);
            });

            e.preventDefault();
            return false;

        }, function(err, e) {
            e.preventDefault();
            return false;
        });
    };

    this.onBeforePageChange = function() {
        console.log('onBeforePageChange NewPresentation');

    };

    this.onAfterPageChange = function(routeType) {
        console.log('onAfterPageChange NewPresentation');

        $this.init();
    };


    return this;
}