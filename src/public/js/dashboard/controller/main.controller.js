/*
 * mainController.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function MainController (dashboard) {
    var $this = this;

    this.noPresentationAnim = undefined;
    this.newPresentation = undefined;
    this.dashboard = dashboard;
    this.route = "main";

    this.init = function() {
        $this.noPresentationAnim = new NoProjectAnimModule($this);
        $this.newPresentation = new NewPresentation($this.dashboard);
    };

    this.onBeforePageChange = function() {
        console.log('onBeforePageChange MainController');
        $this.noPresentationAnim.onBeforePageChange();
    };

    this.onAfterPageChange = function(routeType) {
        console.log('onAfterPageChange MainController');

        if (routeType.length > 0) {
            if (routeType === 'new-presentation') {
                $this.newPresentation.onAfterPageChange();
            }
        } else {
            $('.invira-label').on('click', function(e) {
                var labelid = $(this).data('label-id');

                $this.dashboard.changePageByName('main', 'index-presentations', {labelid: labelid});
                e.preventDefault();
                return false;
            });

            $('.actions > a').on('click', function(e) {
                console.log('clicked on action icon');

                e.preventDefault();
                return false;
            });
            $this.noPresentationAnim.onAfterPageChange();
        }
    };

    $this.init();
    return this;
}