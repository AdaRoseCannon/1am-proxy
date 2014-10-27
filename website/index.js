'use strict';
var express = require('express');
var path = require('path');
var fs = require('fs');

// Express Middleware
var compression = require('compression');
var mustacheEngine = require('hogan-express');
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

var markdown = {
	codeOfConduct: marked(fs.readFileSync(path.join(__dirname, '../coc.md'), {encoding: 'utf8'})),
	readMe: marked(fs.readFileSync(path.join(__dirname, '../README.md'), {encoding: 'utf8'})),
	regInstructions: marked(fs.readFileSync(path.join(__dirname, '../registration_instructions.md'), {encoding: 'utf8'})),
	tips: marked(fs.readFileSync(path.join(__dirname, '../tips.md'), {encoding: 'utf8'}))
};

var partials = {
	header: 'header',
	nav: 'nav'
};

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
		body: markdown.readMe,
		partials: partials
	});
});

app.get('/coc/', function (req, res) {
	res.render('page', {
		title: "1am Club",
		body: markdown.codeOfConduct,
		partials: partials
	});
});

app.get('/tips/', function (req, res) {
	res.render('page', {
		title: "1am Club",
		body: markdown.tips,
		partials: partials
	});
});

app.get('/registration/', function (req, res) {
	res.render('page', {
		title: "1am Club",
		body: markdown.regInstructions,
		partials: partials
	});
});

app.use(express.static(staticFolder));

module.exports = app;