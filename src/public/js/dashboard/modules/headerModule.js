/*
 * headerModule.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function HeaderModule(app) {
    var $this = this;
    this.app = app;

    this.docElem = document.documentElement;
    this.header = document.querySelector('.second-header-inner');
    this.menu = document.querySelector('.invira-menu');
    this.didScroll = false;
    this.changeHeaderOn = 65;

    this.toggleWrapper = undefined;
    this.userMenu = undefined;

    this.init = function() {
        /*
        window.addEventListener( 'scroll', function(event) {
            if(!$this.didScroll) {
                $this.didScroll = true;
                setTimeout($this.scrollPage, 250);
            }
        }, false );
        */

        if ($('#sb-search').length > 0)
            new UISearch( document.getElementById( 'sb-search' ) );

        $this.toggleWrapper = $('.toggle-menu-wrapper');
        $this.userMenu = $('.user-menu-wrapper');
        $(window).on('mouseover', function(e) {
            if ($this.toggleWrapper.hasClass('open'))
                $this.toggleUserMenu();
        });
        $this.toggleWrapper.on('mouseover', function(e) {
            e.preventDefault();
            return false;
        });

        $this.userMenu.on('mouseover', function(e) {
            console.log('clicked');
            if ($this.toggleWrapper.hasClass('closed'))
                $this.toggleUserMenu();
            e.preventDefault();
            return false;
        })
    };

    $this.toggleUserMenu = function() {
        if ($this.toggleWrapper.hasClass('closed')) {
            $this.toggleWrapper.removeClass('closed');
            $this.userMenu.addClass('active');
            $this.toggleWrapper.addClass('open');
        }
        else {
            $this.toggleWrapper.removeClass('open');
            $this.userMenu.removeClass('active');
            $this.toggleWrapper.addClass('closed');
        }
    };

    $this.scrollPage = function() {
        var sy = $this.scrollY();
        if (sy >= $this.changeHeaderOn) {
            $($this.header).addClass('second-header-shrink');
            $($this.menu).addClass('invira-menu-shrink');
        }
        else {
            $($this.header).removeClass('second-header-shrink');
            $($this.menu).removeClass('invira-menu-shrink');

        }

        $this.didScroll = false;
    };

    $this.scrollY  = function() {
        return window.pageYOffset || $this.docElem.scrollTop;
    };

    $this.init();
    return this;
}