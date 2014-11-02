'use strict';
/* globals Promise */
var browserify = require('browserify');
var es6ify = require('es6ify');

function compile(filename) {
	return browserify({ debug: true })
		.add(es6ify.runtime)
		.transform(es6ify)
		.require(require.resolve(filename), { entry: true })
		.bundle();
}

module.exports = function compilePromise(file) {
	return new Promise(function(resolve, reject) {
		var sum = '';
		compile(file)
			.on('data', function (d) {
				sum += d;
			})
			.on('end', function () {
				resolve(sum);
			})
			.on('error', function (err) {
				reject(err);
			});
	});
};