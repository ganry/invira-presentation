/*
 * selectionDrawer.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function SelectionDrawer(parent) {
    var $this = this;
    var editor = parent;

    this.selectionClass = "invira-widget-selection";
    this.currentSelectionElement = undefined;
    this.startX = 0;
    this.beginScaling = false;
    this.startY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;
    this.offsetX = 0;
    this.directionXForward = true;
    this.directionYForward = true;

    this.isSelecting = false;

    this.init = function (x, y) {
        $this.reset();
        $this.beginScaling = true;
        $this.startX = x;
        $this.startY = y;

        $this.offsetX = $('.projector').offset().left;

        $this.currentMouseX = x;
        $this.currentMouseY = y;
    };

    this.setFocusElements = function() {
        editor.resetFocusLight();

        editor.widgetList.each( function () {

            var x, y;

            if ($this.directionXForward)
                x = $this.startX;
            else
                x = $this.startX - $this.getSelectionWidth();

            if ($this.directionYForward)
                y = $this.startY;
            else
                y = $this.startY - $this.getSelectionHeight();

            var selectionRect = {
                left:   x,
                top:    y,
                right:  x + $this.getSelectionWidth() ,
                bottom: y + $this.getSelectionHeight()
            };

            var elementRect = {
                left:   ($(this).offset().left * editor.getScale()),
                top:    ($(this).offset().top * editor.getScale()),
                right:  parseFloat($(this).css('width')) * editor.getScale(),
                bottom: parseFloat($(this).css('height')) * editor.getScale()
            };
            elementRect.right = elementRect.left + elementRect.right;
            elementRect.bottom = elementRect.top + elementRect.bottom;

            //check if element is in selection boundaries
            if (editor.intersectRect(selectionRect, elementRect))
                editor.setFocusOnElement($(this));

            editor.multipleSelection = true;
        });
    };

    this.getSelectionWidth = function() {
        $this.directionXForward = ($this.currentMouseX - $this.startX >= 0);
        return $this.directionXForward ? $this.currentMouseX - $this.startX : $this.startX - $this.currentMouseX;
    };

    this.getSelectionHeight = function() {
        $this.directionYForward = ($this.currentMouseY - $this.startY >= 0);
        return $this.directionYForward ? $this.currentMouseY - $this.startY : $this.startY - $this.currentMouseY;
    };

    this.render = function (x, y)  {

        if (!$this.isSelecting)
            return;

        var width, height;

        $this.currentMouseX = x;
        $this.currentMouseY = y;

        width = $this.getSelectionWidth();
        height = $this.getSelectionHeight();

        if ($this.currentSelectionElement === undefined) {
            var el = '<div class="'+$this.selectionClass+'"></div>';
            $('.projector').append(el);

            $this.currentSelectionElement = $('.'+$this.selectionClass);

            $this.currentSelectionElement.on('mouseup', editor.mouseUp).on('mousemove', editor.mouseMove);
        }

        if ($this.directionXForward)
            $this.currentSelectionElement.css('left', $this.startX - $this.offsetX);
        else
            $this.currentSelectionElement.css('left', $this.startX - $this.offsetX - width);

        if ($this.directionYForward)
            $this.currentSelectionElement.css('top', $this.startY);
        else
            $this.currentSelectionElement.css('top', $this.startY - height);

        $this.currentSelectionElement.css('width', width);
        $this.currentSelectionElement.css('height', height);


        $this.setFocusElements();

    };

    this.reset = function () {
        $this.beginScaling = false;
        $this.startX = 0;
        $this.startY = 0;
        $('.'+$this.selectionClass).remove();
        $this.currentSelectionElement = undefined;
        $this.isSelecting = false;
    };

    return this;
}
