var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var log = require('./libs/log')(module);

var routes = require('./routes/index');

var app = express();

app.use(favicon());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.set('port', process.env.PORT || 3002);

var server = app.listen(app.get('port'), function() {
  log.info('Express server listening on port ' + server.address().port);
});
