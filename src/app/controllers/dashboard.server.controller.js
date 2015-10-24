exports.dashboard = function (req, res) {

    res.render('dashboard/dashboard.html', {
        user: req.user
    })
};