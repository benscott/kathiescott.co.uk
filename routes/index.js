
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

                    console.log('Not cached: Retrieving images from Flickr')

                    Flickr.tokenOnly(flickrOptions, function (error, flickr) {
                        // we can now use "flickr" as our API object,
                        // but we can only call public methods and access public data
                            flickr.people.getPublicPhotos({
                            user_id: process.env.FLICKR_USER_ID,
                            extras: 'description, url_q, url_l'
                        }, function (err, result) {

                            if (err) {
                                throw new Error(err);
                            }

                            params['images'] = []

                            result['photos']['photo'].forEach(function(photo){

                                params['images'].push({
                                    'title': photo['title'],
                                    'thumbnail': photo['url_q'],
                                    'image': photo['url_l'],
                                    'description': photo['description']['_content'].split('\n')
                                })

                            })

                            // Only cache if we have images
                            if(params['images'].length){
                                cache.set(key, params['images'])
                            }

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
