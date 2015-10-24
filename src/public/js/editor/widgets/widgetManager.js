/*
 * widgetManager.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function WidgetManager(editor) {
    var $this = this;

    this.editor = editor;
    this.textWidgetManager = new TextWidgetManager(editor);
    this.codeWidgetManager = new CodeWidgetManager(editor);

    this.addTextWidget = function() {
        $this.textWidgetManager.addTextWidget();
    };

    this.addCodeWidget = function() {
        $this.codeWidgetManager.addCodeWidget();
    };

    return $this;
}