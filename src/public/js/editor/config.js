/*
 * config.js
 *
 * @author: Henry Keller <henry@inapp.eu>
 * @package: invira-editor
 */

function Config() {
    var $this = this;

    var editorDeck = $('#editor-deck');
    var width = 0, height = 0;

    if (editorDeck.length > 0) {
        width = parseInt(editorDeck.data('width'));
        height = parseInt(editorDeck.data('height'));
    } else {
        width = 960;
        height = 700;
    }

    this.init = function () {

        Invira.initialize({
            controls: true,
            progress: false,
            history: false,
            center: false,
            overview: false,
            width: width,
            height: height,
            minScale: 1,
            maxScale: 1,

            transition: 'concave', // none/fade/slide/convex/concave/zoom

            // Optional invira.js plugins
            dependencies: [
                { src: '/js/lib/invira/classList.js', condition: function() { return !document.body.classList; } },
                { src: '/js/lib/invira/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                { src: '/js/lib/invira/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                { src: '/js/lib/invira/plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
                { src: '/js/lib/invira/plugin/zoom-js/zoom.js', async: true },
                { src: '/js/lib/invira/plugin/notes/notes.js', async: true }
            ]
        });
    };

    $this.init();
    return this;
}