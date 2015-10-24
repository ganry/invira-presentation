/*
 * optionsToolbar.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function OptionsToolbar(editor) {
    var $this = this;

    this.editor = editor;
    this.offsetX = 45;
    this.optionsToolbar = undefined;

    this.editCodeDialogHtml = '';

    this.init = function() {
        $this.optionsToolbar = $('.slide-options-toolbar');
        $this.optionList = $('.toolbar-option');
        $this.optionsToolbar.css('left', parseInt($this.editor.editorDeck.offset().left)-$this.offsetX+'px');
        $this.optionsToolbar.css('top', $this.editor.editorDeck.offset().top);

        if ($this.editor.magnetBounds) {
            $('[data-type=magnetBounds]').addClass('active');
        }

        $('[data-type=showCode]').on('mouseup', $this.editCodeClicked).on('mousedown', function(e) {e.stopPropagation();});
        $('[data-type=magnetBounds]').on('mouseup', $this.magnetBoundsClicked).on('mousedown', function(e) {e.stopPropagation();});
        $('[data-type=removeSlide]').on('mouseup', $this.removeSlideClicked).on('mousedown', function(e) {e.stopPropagation();});


        $(window).resize(function() {
            $this.optionsToolbar.css('left', parseInt($this.editor.editorDeck.offset().left)-$this.offsetX+'px');
            $this.optionsToolbar.css('top', $this.editor.editorDeck.offset().top);
        });
    };

    this.editCodeClicked = function(e) {
        var div = $('<div></div>');
        var self = this;
        div.append($this.editor.saveModule.prepareWidgets($this.editor.currentSlide.children().clone()));
        $this.editor.guiManager.dialogManager.showDialog('<textarea id="editHtml">'+div.html()+'</textarea>');/*, 'Save', function() {
            //save html
            cm.save();
            console.log(cm.getDoc().getValue());
            $this.editor.currentSlide.html($(cm.getDoc().getValue()));
        });*/
        var cm = CodeMirror.fromTextArea(document.getElementById("editHtml"), {
            lineNumbers: true,
            mode:  "htmlmixed",
            theme: 'mbo'
        });
        setTimeout(function() {cm.refresh();}, 400);
    };

    this.magnetBoundsClicked = function(e) {
        $(this).toggleClass('active');
        $this.editor.magnetBounds = $(this).hasClass('active');

        if ($this.editor.magnetBounds) {
            $this.editor.checkBoundsOnMultiple();
        }
        e.stopPropagation();
    };
    
    this.removeSlideClicked = function(e) {
        $this.editor.guiManager.dialogManager.showRemoveDialog(
            'Do you really want to remove this slide?',
            function() {
                $this.editor.removeCurrentSlide();
            }
        );
        e.stopPropagation();
    };

    $this.init();
    return this;
}