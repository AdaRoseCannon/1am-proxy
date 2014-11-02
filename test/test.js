'use strict';
var compile = require('../lib/compiler');
var path = require('path');
var log = function (string) {
	return function (message) {console.log(string || '', message);};
};
compile(path.join(__dirname, 'testFile.js')).then(log('Result:')).catch(log('Error:'));