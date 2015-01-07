//var express = require('express');
//var router = express.Router();

var Flickr = require("flickrapi")

module.exports = function(app, cache) {

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('/', function(req, res) {

        var params = {
            'title': 'Kathie Scott portfolio'
        }

        var key = 'flickr-photos'

        var flickrOptions = {
          api_key: process.env.FLICKR_KEY,
          secret: process.env.FLICKR_SECRET
        };

        // Try and retrieve from cache
        cache.get(key, function( err, value ) {

            if (!err) {

                if (value[key] === undefined) {

                    Flickr.tokenOnly(flickrOptions, function (error, flickr) {
                        // we can now use "flickr" as our API object,
                        // but we can only call public methods and access public data
                        flickr.photosets.getPhotos({
                            photoset_id: process.env.FLICKR_PHOTOSET_ID,
                            extras: 'description, url_sq'
                        }, function (err, result) {

                            if (err) {
                                throw new Error(err);
                            }

                            console.log('Not cached: Retrieving images from Flickr')

                            params['images'] = result['photoset']['photo'] || []

                            cache.set(key, params['images'])
                            res.render('index', params);

                        });

                    });

                } else {
                    params['images'] = value[key]
                    res.render('index', params);
                }

            }

        });

    });

};
