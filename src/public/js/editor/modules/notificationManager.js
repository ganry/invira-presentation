/*
 * notificationManager.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */


function NotificationManager(editor) {
    var $this = this;

    this.editor = editor;
    this.defaultShowTime = 6000;

    this.showSuccess = function(msg, time) {
        if (time === undefined)
            time = $this.defaultShowTime;
        // create the notification
        var notification = new NotificationFx({
            message : '<span class="icon fa fa-save fa-2x"></span><p>'+msg+'</p>',
            layout : 'bar',
            //effect : 'slidetop',
            effect : 'exploader',
            /*
             message : '<p>'+result.msg+'</p>',
             layout : 'other',
             effect : 'loadingcircle',
             */
            ttl: time,
            type : 'notice', // notice, warning or error
        });

        // show the notification
        notification.show();
    };

    this.showError = function(msg, time) {

        if (time === undefined)
            time = $this.defaultShowTime;

        // create the notification
        var notification = new NotificationFx({
            message : '<span class="icon fa fa-save fa-2x"></span><p>'+msg+'</p>',
            layout : 'bar',
            //effect : 'slidetop',
            effect : 'exploader',
            /*
             message : '<p>'+result.msg+'</p>',
             layout : 'other',
             effect : 'loadingcircle',
             */
            ttl: time,
            type : 'error', // notice, warning or error
        });


        // show the notification
        notification.show();
    };

    return $this;
}