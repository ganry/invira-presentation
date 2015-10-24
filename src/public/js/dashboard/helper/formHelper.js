/*
 * formHelper.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function FormHelper(dashboard) {
    var $this = this;

    this.dashboard = dashboard;

    this.resetElement = function(el, statusIcon) {

        if (statusIcon !== undefined) {
            statusIcon.addClass("icon-check");
            statusIcon.toggleClass("icon-close", "icon-check");
        }

        if (el !== undefined) {
            el.removeClass("error-placeholder");
            el.removeClass("error-input");
            el.off('change');
        }

    };

    this.markInput = function(el, statusIcon) {
        if (statusIcon !== undefined) {
            statusIcon.removeClass("icon-check");
            statusIcon.addClass("icon-close");
        }
        if (el !== undefined) {
            el.addClass("error-placeholder");
            el.addClass("error-input");
        }
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

    this.init = function(el, submitSuccess, submitFailure) {
        el.submit(function(e) {
            var err = $this.validateForm($(this), e);
            if (err) {
                return submitFailure(err, e);
            } else {
                return submitSuccess(e);
            }
        });
    };

    return this;
}