/*
 * dashboard.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-dashboard
 */

function Dashboard(app) {
    var $this = this;
    this.app = app;
    this.currentPage = undefined;
    this.pages = undefined;
    this.container = undefined;
    this.menuItems = undefined;
    this.indicator = undefined;

    //modules
    this.header = undefined;

    this.init = function() {
        $this.header = new HeaderModule($this);

        $this.container = $('#main-view');
        $this.pages = {
            main: new MainController($this),
            user: new UserController($this)
        };

        $('.tooltipster').tooltipster({delay: 650});

        $this.menuItems = $('[data-invira-content-action]');
        $this.indicator = $('#menu-active-indicator');

        $this.menuItems.on('click', this.onMenuItemClicked);

        if ($this.container.length > 0)
            $this.changePageByElement($('[data-invira-main]'));


    };

    this.onMenuItemClicked = function(e) {
        if ($(this).data('route') !== 'editor') {
                $this.changePageByElement($(this));
        } else
            window.location = '/editor';

        e.preventDefault();
        return false;
    };

    this.activateMenuItem = function() {

        var newitem = $('[data-route='+$this.currentPage.route+']');
        if (newitem.length > 1) {
            newitem = newitem.not('[data-route-type]');
        }

        $this.menuItems.each(function() {
            $(this).removeClass('invira-current-item');
        });

        $this.indicator.css('top', newitem.offset().top + 28+'px');
        newitem.addClass('invira-current-item');
    };


    this.onBeforePageChange = function(done) {

        if ($this.currentPage !== undefined) {
            $this.container.fadeOut(0, function() {
                $('#loading-spinner').fadeIn('fast');
                $this.currentPage.onBeforePageChange();
                if (done !== undefined)
                    done();

            });

        } else
            if (done !== undefined)
                done();
    };

    this.onAfterPageChange = function(routeType) {
        if ($this.currentPage !== undefined) {
            $('#loading-spinner').fadeOut('fast', function() {
                $this.container.fadeIn(0);
                $('.inner-tooltips').tooltipster({delay: 650});
                $this.currentPage.onAfterPageChange(routeType);
            });
        }
    };

    this.changePageByName = function(name, type, data) {

        if ($this.pages.hasOwnProperty(name)) {
            $this.onBeforePageChange(function() {
                $this.currentPage = $this.pages[name];

                var routeType = type || '';
                $this.activateMenuItem();

                var route = (routeType.length > 0) ? $this.currentPage.route+'-'+routeType : $this.currentPage.route;

                $this.app.requestHelper.requestContent(route, data, function (result) {
                    $this.container.hide();
                    $this.container.html(result);
                    $this.onAfterPageChange(routeType);
                });
            });

        }
    };

    this.changePageByElement = function(el, data) {

        if ($this.pages.hasOwnProperty(el.data('route'))) {
            $this.onBeforePageChange(function() {
                $this.currentPage = $this.pages[el.data('route')];

                var routeType = el.data('route-type') || '';
                $this.activateMenuItem();

                var route = (routeType.length > 0) ? $this.currentPage.route+'-'+routeType : $this.currentPage.route;

                $this.app.requestHelper.requestContent(route, data, function (result) {
                    $this.container.hide();
                    $this.container.html(result);
                    $this.onAfterPageChange(routeType);
                });
            });

        }
    };


    $this.init();
    return this;
}