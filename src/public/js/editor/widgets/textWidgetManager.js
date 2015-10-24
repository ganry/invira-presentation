/*
 * textWidgetManager.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function TextWidgetManager(editor) {
    var $this = this;

    this.toolbar = $('.edit-toolbar');
    this.editor = editor;
    this.el = undefined;
    this.currentContainer = undefined;

    this.widgetType = "text";
    this.minWidth = "30px";
    this.minHeight = "30px";
    this.colorPicker = undefined;

    this.classSelector = '.present > .invira-widget[data-widget-type=text]';

    this.init = function() {
        $this.colorPicker = $('.wysiwyg-color').colorPicker();
        $('.colorPicker-palette').on('mousedown', function(e) {e.stopPropagation()}).on('mouseup', function(e) {e.stopPropagation()});

        $('#invira-edit-toolbar').on('mousedown', function(e) {e.stopPropagation()}).on('mouseup', function(e) {e.stopPropagation()});
        $('#invira-edit-toolbar select').change($this.toolbarEventHandler);
        $('#invira-edit-toolbar button').click($this.toolbarEventHandler);
        $(window).resize(function() {
            if ($this.editor.isTextEditing)
                $this.alignToolbar($this.currentContainer);
        });
    };

    this.toolbarEventHandler = function(e) {

        switch($(this).data('role')) {
            case 'formatblock':
                console.log(this[this.selectedIndex].value);
                document.execCommand('formatBlock', false, this[this.selectedIndex].value);
                break;
            default:
                document.execCommand($(this).data('role'), false, null);
                break;
        }
    };

    this.render = function(text, htmlTag, zIndex, width, height, left, top) {
        var styleStr = 'height: '+height+'; min-width: '+$this.minWidth+
            'px; min-height: '+$this.minHeight+'px; width: '+width+'px; left: '+left+'px'+
            '; top: '+top+'px';

        return '<div class="invira-widget" data-widget-type="'+$this.widgetType+'" style="'+styleStr+'">' +
            '<div class="invira-widget-content" data-placeholder-tag="'+htmlTag+
            '" style="z-index: '+zIndex+';">'+
            text+
            '</div></div>';
    };

    this.addTextWidget = function() {

        var newWidget = $this.render("text", "p", $this.editor.getHighestZIndex()+1, 100, "auto", $this.editor.width / 2 - 50, $this.editor.height / 2 - 50);

        $('#slide.present').append(newWidget);
        $this.editor.saveModule.setModified();
        //$this.setFocusOnElement($(newWidget));
        $this.editor.widgetEventInit();
    };

    this.alignToolbar = function(el) {

        $this.toolbar.css('left', el.offset().left);
        $this.toolbar.css('top', el.offset().top - 45);
    };

    this.dblClick = function(e) {

        $this.currentContainer = $(this);
        $this.el = $(this).children('.invira-widget-content');
        $this.el.attr('contenteditable', true);

        $this.el.off('click');

        $this.el.on('click', function(e) {
            var target = e.target || e.srcElement;
            var el = $(target);
            console.log(el);

            if (el.attr('color') === undefined) {
                $this.colorPicker.colorPicker.changeColor('#000000', true);
            } else
                $this.colorPicker.colorPicker.changeColor(el.attr('color'), true);
        });
        $(this).addClass('is-editing');
        $this.el.blur(function(e) {
            $this.el.focus();
        });

        $this.editor.isTextEditing = true;
        $this.toolbar.show();
        $this.alignToolbar($(this));

        $(this).children('.invira-widget-content').focus();

        console.log("dlbClick textWidget");

        e.preventDefault();
        return false;
    };

    this.blur = function(e) {
        console.log('blur');

        if ($this.el !== undefined)
            $this.el.off('blur');
        $this.toolbar.hide();
        $this.colorPicker.colorPicker.hidePalette();
        if ($this.el !== undefined) {
            $this.el.attr('contenteditable', false);
            $this.el.parent('.invira-widget').removeClass('is-editing');
        }

        $this.isModified = true;
        $this.el = undefined;
        $this.currentContainer = undefined;

        $this.editor.isTextEditing = false;
    };

    $this.init();
    return this;
}