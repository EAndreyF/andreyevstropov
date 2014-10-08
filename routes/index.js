var jsdom = require('jsdom');
var Handlebars = require('handlebars');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var jquery = require('jquery');
var xmlhttprequest = require("xmlhttprequest");
var path = require('path');
var log = require('../libs/log')(module);

var cache = {};

var html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
var js = require('../public/js/main.js');

router.get(/.*/, function(req, res) {
  var url = req.url.toString();
  log.info(new Date().toJSON());
  log.info(url);
  if (cache[url]) {
    res.send(cache[url]);
  } else {
    jsdom.env({
      html: html,
      done: function (errors, window) {
        window.location.url = url;
        window.Handlebars = Handlebars;
        var $ = jquery(window),
          XMLHttpRequest = xmlhttprequest.XMLHttpRequest;

        $.support.cors = true;
        $.ajaxSettings.xhr = function () {
          return new XMLHttpRequest;
        };

        js.main(window).then(function() {
          res.send(window.document.documentElement.outerHTML);
          cache[url] = window.document.documentElement.outerHTML;
          log.info('loaded end');
        });
      }
    });
  }
});

module.exports = router;