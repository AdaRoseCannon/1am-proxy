'use strict';
var express = require('express');
var path = require('path');

// Express Middleware
var compression = require('compression');
var bodyParser = require('body-parser');
var mustacheEngine = require('hogan-express');
var cookieParser = require('cookie-parser');

/**
 * Local Variables
 */

var app = express();
var templateFolder = path.normalize(path.join(__dirname, './templates'));
var staticFolder = path.normalize(path.join(__dirname, './static')); 

app.engine('ms', mustacheEngine);
app.set('view engine', 'ms');
app.set('views', templateFolder);
app.enable('view cache');

// Use compression
app.use(compression({
  threshold: 512
}));

app.get('/', function (req, res) {
	res.render('page', {
		title: "1am Club",
		partials: {
			header: 'header'
		}
	});
});

app.use(express.static(staticFolder));

// Allow reading request body downstream
app.use(bodyParser.json());
app.use(cookieParser());

module.exports = app;