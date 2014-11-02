'use strict';
/* global Promise */
var compile = require('../lib/compiler');

var path = require('path');
var log = function (string) {
	return function (message) {console.log(string || '', message);};
};
var testFile = path.join(__dirname, 'testFile.js');
var t;
t=Date.now();
Promise.resolve(testFile)
.then(compile)
.then(function () {
	console.log(Date.now() - t);
	t=Date.now();
	return testFile;
})
.then(compile)
.then(function () {
	console.log(Date.now() - t);
	t=Date.now();
	return testFile;
})
.then(compile)
.then(function () {
	console.log(Date.now() - t);
	t=Date.now();
	return testFile;
})
.then(compile)
.then(function () {
	console.log(Date.now() - t);
	t=Date.now();
	return testFile;
})
.catch(log('Error:'));