/*
 * noProjectAnimModule.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function NoProjectAnimModule(dashboard) {
    var $this = this;

    this.dashboard = dashboard;
    this.noPresentationIcon = undefined;
    this.newPresentationButton = undefined;

    this.startLeft = 0;
    this.startTop = 0;

    this.init = function() {
        $this.newPresentationButton = $('.new-project');
        $this.noPresentationIcon = $('#no-projects-icon');

        if ($this.noPresentationIcon.length > 0) {
            $this.startLeft = '50%';
            $this.startTop = $('.no-projects-found > h3').offset().top - $this.noPresentationIcon.width();

            $this.noPresentationIcon.css('left', $this.startLeft);
            $this.noPresentationIcon.css('top', $this.startTop);
        }

    };

    this.animateMoveToButton = function(el, el2, animStartLeft, animStartTop, endPosLeft, endPosTop) {
        el.fadeIn(1200);
        el.animate({left: endPosLeft, top: endPosTop}, 2100, function() {
            el2.parents('.dashboard.actionbar').addClass('popAnimation').addClass('animate');
            $('.no-projects-text').fadeIn(1200);

            setTimeout(function() {
                $('.no-projects-text').fadeOut('fast');
                el2.parents('nav').removeClass('animate');
                el.fadeOut('fast', function() {
                    el.off('click');
                    el.css('left', animStartLeft);
                    el.css('top', animStartTop);
                    $this.animateMoveToButton(el, el2, animStartLeft, animStartTop, endPosLeft, endPosTop);
                });

            }, 4000);
        });
    };

    this.onBeforePageChange = function() {
        if ($this.noPresentationIcon !== undefined) {
            $this.noPresentationIcon.hide();
            $this.noPresentationIcon.stop();
        }
    };

    this.onAfterPageChange = function() {
        $this.init();

        if ($this.noPresentationIcon.length > 0) {
            $this.animateMoveToButton($this.noPresentationIcon, $this.newPresentationButton, this.startLeft,this.startTop, $this.newPresentationButton.offset().left, $this.newPresentationButton.offset().top);
        }
    };

    return this;
}