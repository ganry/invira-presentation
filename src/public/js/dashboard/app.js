/*
 * app.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function App() {
    var $this = this;



    //helper
    this.requestHelper = undefined;
    this.formHelper = undefined;

    //pages
    this.dashboard = undefined;
    this.login = undefined;

    this.init = function() {
        $this.requestHelper = new RequestHelper($this);
        $this.formHelper = new FormHelper($this);
        $this.dialogHelper = new DialogHelper($this);

        $this.dashboard = new Dashboard($this);
        $this.login = new Login($this);
    };

    this.showNotification = function(text, type) {

        // create the notification
        var notification = new NotificationFx({
            message : '<p>'+text+'</p>',
            layout : 'growl',
            effect : 'scale',
            type : type, // notice, warning, error or success
            onClose : function() {

            }
        });

        // show the notification
        notification.show();
    };

    $this.init();
    return this;
}


$(function () {

    var app = new App();

    //disable preloader
    $('.preload-wrapper').hide();

});