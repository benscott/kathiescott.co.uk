var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var NodeCache = require( "node-cache" );
var cache = new NodeCache();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.enable('view cache')

app.engine('mustache', require('hogan-middleware').__express);

// Add less support
app.use(require('less-middleware')(path.join(__dirname, 'public')));

// Add static public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set PORT
app.set('port', (process.env.PORT || 5000));

// Add favicon
//app.use(favicon(__dirname + '/public/favicon.ico'));

// routes ==================================================

require('./routes/index')(app, cache);

// error handlers ==================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start app ==================================================

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

module.exports = app;