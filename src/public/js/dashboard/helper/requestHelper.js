/*
 * requestHelper.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function RequestHelper(app) {
    var $this = this;
    this.app = app;
    this.isRequesting = false;

    this.init = function() {

    };

    this.fade = function (el1, el2) {
        el1.fadeOut('fast', function() {
            el2.fadeIn('400');
        });
    };

    this.requestContent = function(name, data, successCallback, errorCallback) {
        $.ajax({
            type: "POST",
            url: '/content/'+name,
            data: data,
            success: function(result) {
                if (successCallback !== undefined)
                    successCallback(result);
            },
            error: function(result) {
                if (errorCallback !== undefined) {
                    console.log('second error');
                    errorCallback(result);

                }
            }
        });
    };

    this.postContent = function(route, data,successCallback, errorCallback) {

        if (!$this.isRequesting) {
            $this.isRequesting = true;

            $.ajax({
                type: "POST",
                url: route,
                data: data,
                success: function (result) {
                    $this.isRequesting = false;
                    if (successCallback !== undefined)
                        successCallback(result);
                },
                error: function (result) {
                    $this.isRequesting = false;
                    if (errorCallback !== undefined) {
                        errorCallback(result);
                    }
                }
            });
        }
    };


    $this.init();
    return this;
}