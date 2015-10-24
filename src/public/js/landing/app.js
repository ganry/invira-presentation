$(function () {
    //disable preloader
    $('.preload-wrapper').hide();


        var inviraHeader = (function() {

            var docElem = document.documentElement,
                header = document.querySelector('.main-header'),
                didScroll = false,
                changeHeaderOn = 150;

            function init() {
                window.addEventListener( 'scroll', function(event) {
                    if(!didScroll) {
                        didScroll = true;
                        setTimeout(scrollPage, 250);
                    }
                }, false );
            }

            function scrollPage() {
                var sy = scrollY();
                if (sy >= changeHeaderOn) {
                    $(header).addClass('main-header-shrink');
                }
                else {
                    $(header).removeClass('main-header-shrink');
                }
                didScroll = false;
            }

            function scrollY() {
                return window.pageYOffset || docElem.scrollTop;
            }

            init();

        })();


        window.scrollReveal = new scrollReveal( {reset: false} );

        var owl = $('#owl-screenshots');
        owl.owlCarousel({
            items:1,
            loop:true,
            margin:10,
            nav:true,
            autoplay:true,
            autoplayTimeout:4000,
            autoplayHoverPause:true,
            animateOut: 'bounceOutRight',
            animateIn: 'bounceInLeft'
        });

    $('.tooltip').tooltipster();

});