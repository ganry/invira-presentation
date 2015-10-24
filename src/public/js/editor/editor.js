/*
 * editor.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function getSelText()
{
    var txt = '';
    if (window.getSelection)
    {
        txt = window.getSelection();
    }
    else if (document.getSelection) // FireFox
    {
        txt = document.getSelection();
    }
    else if (document.selection)  // IE 6/7
    {
        txt = document.selection.createRange().text;
    }
    else return;

    return txt;
}

function Editor() {

    var $this = this;

    this.focusedElement = undefined;
    this.multipleSelection = false;
    this.isTextEditing = false;
    this.widgetList = undefined;
    this.editorDeck = undefined;
    this.optionsToolbar = undefined;

    this.notificationManager = new NotificationManager($this);
    this.widgetManager = new WidgetManager($this);
    this.selectionDrawer = new SelectionDrawer($this);
    this.saveModule = new SaveModule($this);
    this.userMenu = new UserMenu($this);
    this.guiManager = undefined;
    this.currentSlide = undefined;

    this.clicked = false;
    this.isMoving = false;
    this.canMove = false;
    this.width = 0;
    this.height = 0;

    this.magnetBounds = true;

    this.widgetElementClass = '.present > .invira-widget';
    this.focusElementClass = '.invira-widget-transform.editing-ui.visible';
    this.focusElementHtml = '<div class="invira-widget-transform editing-ui visible"><div class="anchor" data-direction="n"></div><div class="anchor" data-direction="e"></div><div class="anchor" data-direction="s"></div><div class="anchor" data-direction="w"></div><div class="anchor" data-direction="nw"></div><div class="anchor" data-direction="ne"></div><div class="anchor" data-direction="se"></div><div class="anchor" data-direction="sw"></div></div>';

    this.prevClientX = 0;
    this.prevClientY = 0;

    this.widgetEventInit = function() {
        $this.currentSlide = $('#slide.present');
        $this.widgetList = $($this.widgetElementClass);
        $this.widgetList.off('mousedown');
        $this.widgetList.off('mouseup');
        $($this.widgetManager.textWidgetManager.classSelector).off('dblclick');

        $this.widgetList.on('mousedown', $this.mouseDownOnElement).on('mouseup', $this.mouseUpOnElement);
        $($this.widgetManager.textWidgetManager.classSelector).on('dblclick', $this.widgetManager.textWidgetManager.dblClick);
    };

    this.init = function() {
        
        $this.editorDeck = $('#editor-deck');
        $this.width = $this.editorDeck.data('width');
        $this.height = $this.editorDeck.data('height');


        $this.widgetEventInit();
        $(document).on('mousedown', $this.mouseDown).on('mouseup', $this.mouseUp);
        $('html').on('mousemove', $this.mouseMove).keydown($this.keyDown);

        $('.add-horizontal-slide').on('click', function() {
            $this.addSlide('h');
        });

        Invira.addEventListener( 'slidechanged', function( event ) {
            $this.widgetEventInit();
        } );

        
    };

    this.getScale = function() {
        if (Invira.getScale() >= 1.1 || Invira.getScale() <= 1)
            return parseFloat(Invira.getScale());
        return 1;
    };

    this.getHighestZIndex = function() {
        var highestZIndex = 0;
        $($this.widgetElementClass).each(function() {
            var zindex = parseInt($(this).children('.invira-widget-content').css('z-index'));
            if (zindex > highestZIndex)
                highestZIndex = zindex;
        });
        console.log(highestZIndex);
        return highestZIndex;
    };

    this.intersectRect = function(r1, r2) {
        return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
    };

    this.checkBounds = function(el) {

        if (el === undefined)
            el = $this.focusedElement;

        if (el !== undefined) {
            el.stop();

            var focusLeft = parseInt(el.css('left'));
            var focusTop = parseInt(el.css('top'));
            var focusRight = focusLeft + parseInt(el.width());
            var focusBottom = focusTop + parseInt(el.height());
            var dst = 0;

            //left
            if (focusLeft < 0 ) {
                el.animate({
                    left: 0
                }, 500);
            }
            //right
            if (focusRight > $this.editorDeck.width()) {
                dst = $this.editorDeck.width()-parseInt(el.width());
                el.animate({
                    left: dst
                }, 500);
            }
            //top
            if (focusTop < 0) {
                el.animate({
                    top: 0
                }, 500);
            }
            //bottom
            if (focusBottom > $this.editorDeck.height()) {
                dst =  $this.editorDeck.height()-parseInt(el.height());
                el.animate({
                    top: dst
                }, 500);
            }

        }
    };

    this.checkBoundsOnMultiple = function(el) {

        $($this.widgetElementClass).each(function() {
            $this.checkBounds($(this));
        });

    };

    this.removeCurrentWidget = function() {
        if ($this.focusedElement !== undefined) {
            console.log('remove widget');
            $this.focusedElement.remove();
        }
    };

    this.removeCurrentSlide = function() {
        $('#slide.present').remove();

        $('#slide.future').each(function(index) {
            if (index === 0) {
                $(this).removeClass('future');
                $(this).removeClass('past');
                $(this).addClass('present');
            } else {
                $(this).removeClass('present');
                $(this).removeClass('past');
                $(this).addClass('future');
            }
        });
    };

    this.resetModifiable = function() {

        if ($this.magnetBounds && !$this.isTextEditing && $this.isMoving) {
            if ($this.multipleSelection) {
                $this.checkBoundsOnMultiple();
            } else
                $this.checkBounds();
        }

        $this.prevClientX = 0;
        $this.prevClientY = 0;

        $this.isMoving = false;
        $this.canMove = false;
        $this.isScaling = false;
        $this.scaleDirection = "";


    };

    this.resetFocusLight = function() {
        $($this.focusElementClass).remove();
        $this.widgetList.removeClass('is-focused');

        if ($this.focusedElement !== undefined) {
            $this.focusedElement.stop();
        }
    };

    this.resetFocusedElement = function() {
        console.log('reset');

        $this.guiManager.editMenu.showAddMenu();
        $this.resetModifiable();
        $this.multipleSelection = false;

        $($this.focusElementClass).remove();
        $this.widgetList.removeClass('is-focused');

        if ($this.focusedElement !== undefined) {
            $this.focusedElement.stop();
            $this.widgetManager.textWidgetManager.blur();
        }

        $this.focusedElement = undefined;
    };

    this.setFocusOnElement = function(el) {
        el.append($this.focusElementHtml);
        el.addClass('is-focused');

        if (el.data('widget-type') == 'text') {
            el.children($this.focusElementClass).attr('data-horizontal', "true");
            el.children($this.focusElementClass).attr('data-vertical', "false");
        } else if (el.data('widget-type') == 'code') {
            el.children($this.focusElementClass).attr('data-horizontal', "true");
            el.children($this.focusElementClass).attr('data-vertical', "true");
        }
        $('.anchor').off().on('mousedown', $this.mouseDownOnAnchor).on('mouseup', $this.mouseUp);
    };

    this.moveWidgetByAmount = function(el, xAmount, yAmount) {

        if (!$this.saveModule.isModified)
            $this.saveModule.setModified();

        $this.isMoving = true;

        var distanceX = xAmount;
        var distanceY = yAmount;
        var zoom = $this.getScale();
        var currentX, currentY, newX, newY;

        currentX = parseFloat(el.css('left'));
        currentY = parseFloat(el.css('top'));

        newX = (currentX - (distanceX / zoom));
        newY = (currentY - (distanceY / zoom));
        el.css('left', newX);
        el.css('top', newY);
    };

    this.moveWidget = function(e) {

        var distanceX = $this.prevClientX - e.pageX;
        var distanceY = $this.prevClientY - e.pageY;

        //$($this.widgetElementClass+'.is-focused').
        $this.widgetList.each(function() {

            if ($(this).is('.is-focused')) {
                $this.moveWidgetByAmount($(this), distanceX, distanceY);

                $this.prevClientX = e.pageX;
                $this.prevClientY = e.pageY;
            }
        });

        e.stopPropagation();
    };

    this.resizeWidget = function(e) {

        if (!$this.saveModule.isModified)
            $this.saveModule.setModified();

        var distanceX = $this.prevClientX - e.pageX;
        var distanceY = $this.prevClientY - e.pageY;
        var zoom = $this.getScale();
        var currentX, currentY, currentWidth, currentHeight, newX, newY, newWidth, newHeight;

        if ($this.scaleDirection == "w") {

            currentX = parseFloat($this.focusedElement.css('left'));
            currentWidth = parseFloat($this.focusedElement.css('width'));

            newX = (currentX - (distanceX / zoom));
            newWidth = (currentWidth + (distanceX / zoom));

            if (newWidth < parseFloat($this.focusedElement.css('min-width'))) {
                newWidth = parseFloat($this.focusedElement.css('width'));
                newX = currentX;
            }

            $this.focusedElement.css('left', newX);
            $this.focusedElement.css('width', newWidth);
        } else if ($this.scaleDirection == "e") {

            currentWidth = parseFloat($this.focusedElement.css('width'));
            newWidth = (currentWidth - (distanceX / zoom));
            $this.focusedElement.css('width', newWidth);
        } else if ($this.scaleDirection == "n") {

            currentY = parseFloat($this.focusedElement.css('top'));
            currentHeight = parseFloat($this.focusedElement.css('height'));

            newY = (currentY - (distanceY / zoom));
            newHeight = (currentHeight + (distanceY / zoom));

            if (newHeight < parseFloat($this.focusedElement.css('min-height'))) {
                newHeight = parseFloat($this.focusedElement.css('height'));
                newY = currentY;
            }

            $this.focusedElement.css('top', newY);
            $this.focusedElement.css('height', newHeight);

        } else if ($this.scaleDirection == "s") {

            currentHeight = parseFloat($this.focusedElement.css('height'));
            newHeight = (currentHeight - (distanceY / zoom));
            $this.focusedElement.css('height', newHeight);
        } else if ($this.scaleDirection == "nw") {

            currentX = parseFloat($this.focusedElement.css('left'));
            currentWidth = parseFloat($this.focusedElement.css('width'));
            currentY = parseFloat($this.focusedElement.css('top'));
            currentHeight = parseFloat($this.focusedElement.css('height'));

            newX = (currentX - (distanceX / zoom));
            newWidth = (currentWidth + (distanceX / zoom));
            newY = (currentY - (distanceY / zoom));
            newHeight = (currentHeight + (distanceY / zoom));

            if (newWidth < parseFloat($this.focusedElement.css('min-width'))) {
                newWidth = parseFloat($this.focusedElement.css('width'));
                newX = currentX;
            }
            if (newHeight < parseFloat($this.focusedElement.css('min-height'))) {
                newHeight = parseFloat($this.focusedElement.css('height'));
                newY = currentY;
            }

            $this.focusedElement.css('left', newX);
            $this.focusedElement.css('width', newWidth);
            $this.focusedElement.css('top', newY);
            $this.focusedElement.css('height', newHeight);
        } else if ($this.scaleDirection == "ne") {

            currentWidth = parseFloat($this.focusedElement.css('width'));
            currentY = parseFloat($this.focusedElement.css('top'));
            currentHeight = parseFloat($this.focusedElement.css('height'));

            newWidth = (currentWidth - (distanceX / zoom));
            newY = (currentY - (distanceY / zoom));
            newHeight = (currentHeight + (distanceY / zoom));

            if (newHeight < parseFloat($this.focusedElement.css('min-height'))) {
                newHeight = parseFloat($this.focusedElement.css('height'));
                newY = currentY;
            }

            $this.focusedElement.css('width', newWidth);
            $this.focusedElement.css('top', newY);
            $this.focusedElement.css('height', newHeight);
        } else if ($this.scaleDirection == "sw") {

            currentX = parseFloat($this.focusedElement.css('left'));
            currentWidth = parseFloat($this.focusedElement.css('width'));
            currentHeight = parseFloat($this.focusedElement.css('height'));

            newX = (currentX - (distanceX / zoom));
            newWidth = (currentWidth + (distanceX / zoom));
            newHeight = (currentHeight - (distanceY / zoom));

            if (newWidth < parseFloat($this.focusedElement.css('min-width'))) {
                newWidth = parseFloat($this.focusedElement.css('width'));
                newX = currentX;
            }

            $this.focusedElement.css('left', newX);
            $this.focusedElement.css('width', newWidth);
            $this.focusedElement.css('height', newHeight);
        } else if ($this.scaleDirection == "se") {

            currentWidth = parseFloat($this.focusedElement.css('width'));
            currentHeight = parseFloat($this.focusedElement.css('height'));

            newWidth = (currentWidth - (distanceX / zoom));
            newHeight = (currentHeight - (distanceY / zoom));

            $this.focusedElement.css('width', newWidth);
            $this.focusedElement.css('height', newHeight);
        }

        $this.prevClientX = e.pageX;
        $this.prevClientY = e.pageY;

        e.stopPropagation();
    };

    this.mouseDownOnAnchor = function(e) {

        if ($(this).parent().parent().is($this.widgetElementClass)) {
            $this.clicked = true;
            console.log("mouseDownOnAnchor");
            $this.focusedElement = $(this).parent().parent();
            $this.prevClientX = e.pageX;
            $this.prevClientY = e.pageY;
            $this.isMoving = false;
            $this.canMove = false;
            $this.isScaling = true;
            $this.scaleDirection = $(this).data('direction');
        } else {
            $this.resetFocusedElement();
        }

        e.stopPropagation();
    };

    this.mouseDownOnElement = function (e) {

        if (e.which != 1)
            return true;

        console.log('mouseDownOnElement');
        $this.clicked = true;

        if ($this.isTextEditing && $(this).is('.is-focused'))
        {
            e.stopPropagation();
        }
        else
        {
            if (!$this.multipleSelection || ($this.multipleSelection && !$(this).is('.is-focused')))
                $this.resetFocusedElement();

            if ($(this).is($this.widgetElementClass)) {

                $this.focusedElement = $(this);

                $this.setFocusOnElement($(this));
                $this.guiManager.editMenu.showMenuForWidget();
                $this.prevClientX = e.pageX;
                $this.prevClientY = e.pageY;

                $this.canMove = true;
            }

            e.stopPropagation();
        }
    };

    this.mouseUpOnElement = function(e) {

        if (e.which != 1)
            return true;

        //console.log(getSelText().extentNode);


        console.log('mouseUpOnElement');
        console.log($this.isMoving);
        $this.resetModifiable();
        $this.selectionDrawer.reset();

        $this.clicked = false;

        e.stopPropagation();
    };

    this.mouseUp = function(e) {

        if (e.which != 1)
            return true;

        console.log('mouseUp');

        if ($this.focusedElement !== undefined && $this.isScaling)
            $this.resetModifiable();

        $this.selectionDrawer.reset();
        $this.clicked = false;

        e.stopPropagation();
    };

    this.mouseDown = function (e) {

        if (e.which != 1)
            return true;

        $this.clicked = true;

        $this.resetFocusedElement();
        if (e.which == 1)
            $this.selectionDrawer.init(e.pageX, e.pageY);

        console.log('mouseDown');

        e.stopPropagation();
        e.preventDefault();
    };

    this.mouseMove = function(e) {

        if ($this.clicked && !$this.guiManager.dialogManager.dialogOpen) {

            if (!$this.isTextEditing && ($this.selectionDrawer.isSelecting || $this.selectionDrawer.beginScaling)) {
                if ($this.selectionDrawer.beginScaling)
                    $this.selectionDrawer.isSelecting = true;
                $this.selectionDrawer.render(e.pageX, e.pageY);
                e.preventDefault();
                return false;
            }


            if ($this.focusedElement !== undefined && !$this.selectionDrawer.isSelecting && !$this.isTextEditing) {
                if ($this.canMove) {
                    $this.moveWidget(e);
                    e.preventDefault();
                    return false;
                } else if ($this.isScaling) {
                    $this.resizeWidget(e);
                    e.preventDefault();
                    return false;
                }
            }
        }

    };

    this.keyDown = function(e) {

        if (($this.focusedElement !== undefined || $this.multipleSelection) && (!$this.isTextEditing) && !$this.guiManager.dialogManager.dialogOpen && (e.keyCode == 37 || e.keyCode == 39|| e.keyCode == 38 || e.keyCode == 40)) {

            if (e.keyCode == 37) {
                $('.invira-widget.is-focused').each(function() {
                    $this.moveWidgetByAmount($(this), 1, 0);
                });
            } else if (e.keyCode == 39) {
                $('.invira-widget.is-focused').each(function() {
                    $this.moveWidgetByAmount($(this), -1, 0);
                });
            } else if (e.keyCode == 38) {
                $('.invira-widget.is-focused').each(function() {
                    $this.moveWidgetByAmount($(this), 0, 1);
                });
            } else if (e.keyCode == 40) {
                $('.invira-widget.is-focused').each(function() {
                    $this.moveWidgetByAmount($(this), 0, -1);
                });
            }

            e.stopPropagation();
        }
    };

    this.addSlide = function(direction) {
        if (direction == 'h') {
            $('#slide.present').after('<section id="slide" class="future" style="display: block;" hidden="" aria-hidden="true"></section>');
            Invira.next();
        } else if (direction == 'v') {

        }
    };


    $this.init();
    return this;
}