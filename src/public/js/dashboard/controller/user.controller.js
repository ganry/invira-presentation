/*
 * userController.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function UserController (dashboard) {
    var $this = this;

    this.dashboard = dashboard;
    this.route = "user";

    this.init = function() {

    };

    this.onBeforePageChange = function() {
        console.log('onBeforePageChange');

    };

    this.onAfterPageChange = function() {
        console.log('onAfterPageChange');
    };

    $this.init();
    return this;
}