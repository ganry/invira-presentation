/**
 * Touch-based remote controller for your presentation courtesy 
 * of the folks at http://remotes.io
 */

(function(window){

    /**
     * Detects if we are dealing with a touch enabled device (with some false positives)
     * Borrowed from modernizr: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touch.js   
     */
    var hasTouch  = (function(){
        return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
    })();

    /**
     * Detects if notes are enable and the current page is opened inside an /iframe
     * this prevents loading Remotes.io several times
     */
    var isNotesAndIframe = (function(){
        return window.InviraNotes && !(self == top);
    })();

    if(!hasTouch && !isNotesAndIframe){
        head.ready( 'remotes.ne.min.js', function() {
            new Remotes("preview")
                .on("swipe-left", function(e){ Invira.right(); })
                .on("swipe-right", function(e){ Invira.left(); })
                .on("swipe-up", function(e){ Invira.down(); })
                .on("swipe-down", function(e){ Invira.up(); })
                .on("tap", function(e){ Invira.next(); })
                .on("zoom-out", function(e){ Invira.toggleOverview(true); })
                .on("zoom-in", function(e){ Invira.toggleOverview(false); })
            ;
        } );

        head.js('https://hakim-static.s3.amazonaws.com/invira-js/remotes.ne.min.js');
    }
})(window);