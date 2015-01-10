
module.exports = function(app, cache) {

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('/cache-clear', function(req, res) {

        console.log('Cache clear');
        cache.del('flickr-photos')
        res.redirect(302, '/');

    });

};
