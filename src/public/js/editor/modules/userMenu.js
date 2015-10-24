function UserMenu(editor) {
    var $this = this;

    this.editor = editor;
    this.toggleWrapper = undefined;
    this.userMenu = undefined;

    this.init = function() {
        console.log('init');
        $this.toggleWrapper = $('.toggle-menu-wrapper');
        $this.userMenu = $('.user-menu-wrapper');
        $this.userMenu.on('click', function() {
            console.log('clicked');
            if ($this.toggleWrapper.hasClass('closed')) {
                $this.toggleWrapper.removeClass('closed');
                $this.toggleWrapper.addClass('open');
            }
            else {
                $this.toggleWrapper.removeClass('open');
                $this.toggleWrapper.addClass('closed');
            }
        })
    };

    $this.init();
    return this;
}