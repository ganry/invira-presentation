/*
 * dialogHelper.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function DialogHelper(editor) {
    var $this = this;

    this.app = app;
    this.dialogOpen = false;

    this.init = function() {
    };

    this.getDialogHtml = function(content, width, secondButtonText) {
        var secondButton = '';
        if (secondButtonText !== undefined)
            secondButton = '<button class="btn btn-normal btn-normal-a action" data-dialog-second>'+secondButtonText+'</button>';

        return '<div id="default-dialog" class="dialog"><div class="dialog__overlay"></div><div class="dialog__content" style="width: '+width+'"><div class="dialog-content">'+content+'</div><div class="dialog-button-footer"><button class="btn btn-normal btn-close action" data-dialog-close>Close</button>'+secondButton+'</div></div></div>';

    };

    this.showDialog = function(content, width, secondButtonText, secondButtonCallback) {
        $this.dialogOpen = true;

        if (width === undefined)
            width = "50%";

        $('#default-dialog').remove();
        $('.projector').append($this.getDialogHtml(content, width, secondButtonText));
        $('#default-dialog').on('mousedown', function(e) {e.stopPropagation();}).on('mouseup',function(e) {e.stopPropagation();});

        if (secondButtonText !== undefined) {
            $('[data-dialog-second]').off().on('click', function (e) {
                console.log('secondButton Click');
                if (secondButtonCallback !== undefined)
                    secondButtonCallback();
                dlg.toggle();

                e.preventDefault();
                return false;
            });
        }

        var dialog = document.getElementById( 'default-dialog');
        dlg = new DialogFx( dialog , {onCloseDialog : function() { console.log('dialogClosed');$this.dialogOpen = false;}});
        dlg.toggle();
    };

    $this.init();
    return this;
}