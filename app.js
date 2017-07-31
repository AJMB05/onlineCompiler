require('./api/data/dbconnections.js').open();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser({ extended : false }));
//sets port for the app
app.set('port',80);
//sets route for mvc architecture
var routes = require('./api/routes');

//Log access to app
app.use(function(req, res, next){
	console.log(req.method, req.url);
	next();
});

//public files
app.use(express.static(path.join(__dirname, 'public')));
//subset of routes
app.use('/', routes);

var server = app.listen(app.get('port'), function(){
  console.log('Server listening on port ' + server.address().port);
});
