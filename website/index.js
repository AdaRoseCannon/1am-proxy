'use strict';
var express = require('express');
var path = require('path');
var fs = require('fs');

// Express Middleware
var compression = require('compression');
var bodyParser = require('body-parser');
var mustacheEngine = require('hogan-express');
var cookieParser = require('cookie-parser');
var marked = require('marked');

/**
 * Local Variables
 */

marked.setOptions({
	gfm: true,
	tables: true,
	breaks: true,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false
});

var app = express();
var templateFolder = path.normalize(path.join(__dirname, './templates'));
var staticFolder = path.normalize(path.join(__dirname, './static')); 
var codeOfConduct = marked(fs.readFileSync(path.join(__dirname, '../coc.md'), {encoding: 'utf8'})); 
var readMe = marked(fs.readFileSync(path.join(__dirname, '../README.md'), {encoding: 'utf8'}));

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
		body: readMe,
		partials: {
			header: 'header',
		}
	});
});

app.get('/coc/', function (req, res) {
	res.render('page', {
		title: "1am Club",
		body: codeOfConduct,
		partials: {
			header: 'header',
		}
	});
});

app.use(express.static(staticFolder));

// Allow reading request body downstream
app.use(bodyParser.json());
app.use(cookieParser());

module.exports = app;