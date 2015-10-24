/*
 * editMenuModule.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function EditMenuModule(editor) {
    var $this = this;

    this.editor = editor;
    this.addWidgetToolbar = undefined;
    this.textWidgetToolbar = undefined;
    this.codeWidgetToolbar = undefined;


    this.init = function() {
        $('.toolbars').on('mousedown', function(e) {e.stopPropagation();}).on('mouseup', function(e) {e.stopPropagation();});

        $this.addWidgetToolbar = $('.toolbar[data-type=add]');
        $this.textWidgetToolbar = $('.toolbar[data-type=text]');
        $this.codeWidgetToolbar = $('.toolbar[data-type=code]');

        $('.toolbar-add-block-option[data-widget-type=text]').on('click', $this.editor.widgetManager.textWidgetManager.addTextWidget);
        $('.toolbar-add-block-option[data-widget-type=code]').on('click', $this.editor.widgetManager.codeWidgetManager.addCodeWidget);
        $this.showAddMenu();

        $('.toolbars-actionbar > button').on('click', $this.globalActionBarclicked);
    };

    this.globalActionBarclicked = function(e) {

        if ($this.editor.focusedElement !== undefined) {

            var inviraBlock = $this.editor.focusedElement.children('.invira-widget-content');

            //delete widget
            if ($(this).data('role') == 'trash') {
                $this.editor.guiManager.dialogManager.showRemoveDialog(
                    'Do you really want to remove this element?',
                    function() {
                        $this.editor.removeCurrentWidget();
                    }
                );
            }
            //maximize
            else if ($(this).data('role') == 'maximize') {
                $this.editor.focusedElement.css('left', 0);
                $this.editor.focusedElement.css('width', $this.editor.width);

                if ($this.editor.focusedElement.data('widget-type') !== 'text') {
                    $this.editor.focusedElement.css('top', 0);
                    $this.editor.focusedElement.css('height', $this.editor.height);
                }
            }
            //z-index up on focused widget
            else if ($(this).data('role') == 'depthUp') {
                inviraBlock.css('z-index', parseInt(inviraBlock.css('z-index')) + 1);
            }
            //z-index down on focused widget
            else if ($(this).data('role') == 'depthDown') {
                inviraBlock.css('z-index', parseInt(inviraBlock.css('z-index')) - 1);
            }
        }
    };

    this.showTextMenu = function() {
        $this.addWidgetToolbar.css('left', '168px');
        $this.addWidgetToolbar.removeClass('visible');
        $this.codeWidgetToolbar.css('left', '168px');
        $this.codeWidgetToolbar.removeClass('visible');

        $this.textWidgetToolbar.css('left', '0px');
        $this.textWidgetToolbar.addClass('visible');
    };

    this.showCodeMenu = function() {
        $this.addWidgetToolbar.css('left', '168px');
        $this.addWidgetToolbar.removeClass('visible');
        $this.textWidgetToolbar.css('left', '168px');
        $this.textWidgetToolbar.removeClass('visible');

        $this.codeWidgetToolbar.css('left', '0px');
        $this.codeWidgetToolbar.addClass('visible');
    };

    this.showAddMenu = function() {
        $this.textWidgetToolbar.css('left', '168px');
        $this.textWidgetToolbar.removeClass('visible');
        $this.codeWidgetToolbar.css('left', '168px');
        $this.codeWidgetToolbar.removeClass('visible');

        $this.addWidgetToolbar.css('left', '0px');
        $this.addWidgetToolbar.addClass('visible');
    };


    this.showMenuForWidget = function() {
        console.log('showMenu');
        if ($this.editor.focusedElement !== undefined && !$this.editor.multipleSelection) {
            console.log('showMenu');
            if ($this.editor.focusedElement.data('widget-type') == 'text') {
                $this.showTextMenu();
            } else if ($this.editor.focusedElement.data('widget-type') == 'code') {
                $this.showCodeMenu();
            }
        } else {
            console.log('showAddMenu');

            $this.showAddMenu();
        }

    };

    $this.init();
    return this;
}