//var express = require('express');
//var router = express.Router();

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "f53d8432570679baf7f6b78f0046efba",
      secret: "7bbb4bee7053f108"
    };

console.log(process.env.FLICKR_API_KEY);

module.exports = function(app, cache) {

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('/', function(req, res) {

        var params = {
            'title': 'Kathie Scott portfolio'
        }

        var key = 'flickr-photos'

        // Try and retrieve from cache
        cache.get(key, function( err, value ) {

            if (!err) {

                if (value[key] === undefined) {

                    Flickr.tokenOnly(flickrOptions, function (error, flickr) {
                        // we can now use "flickr" as our API object,
                        // but we can only call public methods and access public data
                        flickr.photosets.getPhotos({
                            photoset_id: "72157650146062711",
                            extras: 'description, url_sq'
                        }, function (err, result) {

                            if (err) {
                                throw new Error(err);
                            }

                            console.log('NOT CACHED')

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
