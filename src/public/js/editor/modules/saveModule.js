/*
 * saveModule.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function getContrast50(hexcolor){
    return (parseInt(hexcolor, 16) > 0xffffff/2) ? 'black':'white';
}

function SaveModule(editor) {
    var $this = this;

    this.editor = editor;
    this.saveButton = undefined;
    this.isModified = false;

    this.init = function() {

        $this.saveButton = $('[data-invira-save-action]');

        $this.saveButton.on('click', function() {
            $this.save($('.slides'));
        });

        $this.loadBackgrounds();

    };

    this.loadBackgrounds = function() {

        var el = $('.backgrounds > .slide-background');
        $('[data-background-color]').each(function (index) {
            el.eq(index).css('background-color', ($(this).data('background-color')));
            console.log('contrast '+getContrast50($(this).data('background-color')));
        });
    };

    this.setModified = function() {
        console.log('set Modified');
        $this.isModified = true;
        /*
        $this.saveButton.removeClass('fa-desktop');
        $this.saveButton.removeClass('fa-check');

        $this.saveButton.addClass('fa-save');
        */
    };

    this.prepareWidgets = function(el) {

        el.each(function (index) {
            var blockType = $(this).data('widget-type');
            var widget = $(this);

            $(this).removeClass('is-focused');
            $(this).removeClass('is-editing');

            $(this).children().remove($this.editor.focusElementClass);

            //invira-widget-content
            $(this).children().each( function(index) {

                //remove contenteditable
                $(this).attr('contenteditable', false);

                //code
                if (blockType == "code") {
                    //code textarea and pre block
                    var div = $(this).children('.code-block-textarea');
                    $(this).children('pre').remove();
                    $(this).append('<pre class="'+div.data('language')+'"><code>'+div.html()+'</code></pre>');
                }
            });
        });
        return el;
    };

    this.prepareSlideContent = function(content) {

        var preparedContent = content.clone();


        //slides
        preparedContent.children().each(function (index) {
            //remove present, past, future from slides
            $(this).removeClass('present');
            $(this).removeClass('past');
            $(this).removeClass('future');

            //add present to first element
            if (index === 0)
                $(this).addClass('present');

            //widgets
            $this.prepareWidgets($(this).children());

        });

        console.log(preparedContent);
        return preparedContent;
    };

    this.save = function(slidescontent, successCallback, errorCallback) {

        console.log('save');
        slidescontent = $this.prepareSlideContent(slidescontent);

        //$this.isModified = false;

        if ($this.isModified) {

            $.ajax({
                type: "POST",
                url: '/editor/save/slides',
                dataType: 'json',
                data: {"slidescontent": $.trim(slidescontent.html())},

                success: function(result) {
                    if(result.status == 200) {

                        if (successCallback !== undefined)
                            successCallback();

                        $this.isModified = false;
                        /*
                        $this.saveButton.removeClass('fa-save');
                        $this.saveButton.removeClass('fa-desktop');
                        $this.saveButton.addClass('fa-check');
                        setTimeout(function(){ $this.saveButton.addClass('fa-desktop'); }, 2500);
                        */

                        $this.editor.notificationManager.showSuccess(result.msg);
                    }
                    console.log('saved');

                },
                error: function() {

                    if (errorCallback !== undefined)
                        errorCallback();

                    $this.editor.notificationManager.showError('We couldn\'t save your presentation, please try again');
                }
            });
        }
    };

    $this.init();

    return this;
}