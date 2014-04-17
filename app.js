
/**
 * Module dependencies.
 */
(function() {
    var express = require('express'),
        http = require('http'),
        fs = require('fs'),
        log = require('./libs/log')(module),
        jsdom = require('jsdom'),
        Handlebars = require('handlebars'),

        html = fs.readFileSync('./index.html', 'utf-8'),
        js = require("./public/js/main.js"),

        app = express();

    // all environments
    app.set('port', 3000);
    app.use(app.router);

    // development only
    app.use(express.errorHandler());

    app.get(/.*/, function(req, res) {
        var url = req.url;
        log.info(url);
        jsdom.env({
          html: html,
          done: function (errors, window) {
            window.location.url = url;
            window.Handlebars = Handlebars;
            var $ = require('jquery')(window),
                XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

            $.support.cors = true;
            $.ajaxSettings.xhr = function () {
                return new XMLHttpRequest;
            };
            
            js.main(window).then(function() {
                res.send(window.document.documentElement.outerHTML);
                log.info('loaded end');
            });
          }
        });
    });

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
})();
