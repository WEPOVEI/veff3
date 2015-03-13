/*
	Dependencies
*/
var express = require('express'),
	mongoose = require('mongoose');

var	app = express();

var config = require('./config/config'),
	auth = require('./config/authorization');
	
/*
	Database connection
*/
var db = mongoose.connection;

db.on('connected', function () {
	console.log('Connected to MongoDB');
});

db.on('disconnected', function () {
	console.log(config)
	console.log('MongoDB disconnected');
	mongoose.connect(config.db, { server: { auto_reconnect: true } });
});

mongoose.connect(config.db, { server: { auto_reconnect: true } });


// Configuration
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	next();
});

app.set('config', config);

app.use(express.logger()); // Log every output to the console

app.use(express.cookieParser(config.secret));
app.use(express.json()); // Parse request body
app.use(express.urlencoded()); // Parse url query string

app.use(app.router);

// Error handling middleware
app.use(function (err, req, res, next) {

	if (err) {
		res.send(500, err);
	} else {
		next();
	}
});

//require('./config/passport')(passport);
require('./config/routes')(app, auth);

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Server is listening on port ' + port);