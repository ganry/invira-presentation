/*
 * selectionDrawer.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */


function CodeWidgetManager(editor) {
    var $this = this;

    this.editor = editor;
    this.el = undefined;
    this.currentContainer = undefined;

    this.widgetType = "code";
    this.minWidth = "30px";
    this.minHeight = "30px";

    this.classSelector = '.present > .invira-widget[data-widget-type=code]';

    this.init = function() {

    };

    this.render = function(zIndex, width, height, left, top) {
        var styleStr = 'height: '+height+'px; min-width: '+$this.minWidth+
            '; min-height: '+$this.minHeight+'; width: '+width+'px; left: '+left+'px'+
            '; top: '+top+'px';
        console.log(styleStr);

        return '<div class="invira-widget" data-widget-type="'+$this.widgetType+'" style="'+styleStr+'">' +
            '<div class="invira-widget-content" style="z-index: '+zIndex+';">'+
            '<div class="code-block-textarea"></div>' +
            '<div class="editing-ui invira-widget-overlay invira-widget-placeholder" style="z-index: '+zIndex+';"></div>'+
            '</div></div>';
    };

    this.addCodeWidget = function() {
        var newWidget = $this.render($this.editor.getHighestZIndex()+1, 300, 300,  $this.editor.width / 2 - 150, $this.editor.height / 2  - 150);

        $this.editor.saveModule.setModified();
        $this.editor.setFocusOnElement($('#slide.present').append(newWidget));
        $this.editor.widgetEventInit();
    };

    this.dblClick = function(e) {

        $this.currentContainer = $(this);
        $this.el = $(this).children('.invira-widget-content');

        e.preventDefault();
        return false;
    };

    $this.init();
    return this;
}