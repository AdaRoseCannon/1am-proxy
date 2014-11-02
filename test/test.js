'use strict';
var compile = require('../lib/compiler');
var path = require('path');
var log = function () {
	console.log(arguments);
};
compile(path.join(__dirname, 'testFile.js')).then(log).catch(log);