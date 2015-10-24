/*
 * guiManager.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function GuiManager(editor) {
    var $this = this;

    this.editor = editor;
    this.editMenu = undefined;
    this.optionsToolbar = undefined;
    this.dialogManager = undefined;

    this.init = function() {
        $this.editMenu = new EditMenuModule($this.editor);
        $this.dialogManager = new DialogManager($this.editor);
        
        $this.optionsToolbar = new OptionsToolbar($this.editor);
    };



    $this.init();
    return this;
}