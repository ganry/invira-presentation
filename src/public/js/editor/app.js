/*
 * app.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

$( function () {

    var config = new Config();
    var editor = new Editor();
    editor.guiManager = new GuiManager(editor);
    $('.tooltip').tooltipster();

    //slides loaded
    Invira.addEventListener( 'ready', function( event ) {

        //disable preloader
        $('.preload-wrapper').hide();
    } );
    var dlgtrigger = document.querySelector( '[data-dialog]'),
        dlg = new DialogFx( document.getElementById( "aboutDialog" ));

    $('#aboutDialog').off('mousedown').off('mouseup');
    $('#aboutDialog').on('mousedown', function(e) {e.stopPropagation();}).on('mouseup',function(e) {e.stopPropagation();})
    dlgtrigger.addEventListener( 'click', dlg.toggle.bind(dlg) );

} );