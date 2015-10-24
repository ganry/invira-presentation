module.exports = function() {

    exports.get = function (req, res) {

        if (req.session.lastVisit) {
            console.log(req.session.lastVisit);
        }
        req.session.lastVisit = new Date();

        res.render('index.html', {
            user: req.user
        });
    };

    exports.post = function (req, res) {
        res.send("/ post");
    };

    return exports;
};