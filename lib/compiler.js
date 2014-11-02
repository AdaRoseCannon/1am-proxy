'use strict';
/* global Promise */

var denodeify = require('denodeify');
var fs = {};
fs.exists = denodeify(require('fs').exists);
fs.readFile = denodeify(require('fs').readFile);
var Traceur = require('traceur').NodeCompiler;
var destPath = '/tmp/out.js';
var cache = require('./cache');

var compiler = new Traceur({
	sourceMaps: true,
	modules: 'commonjs'
});

module.exports = function compile(filename) {
	return fs.exists(filename).then(function (exists) {
		if (!exists) return Promise.reject('File Does Not Exist');
		return cache.check(filename);
	}).then(function(cached) {
		if (!cached) return fs.readFile(filename, {encoding: 'utf8'});
		return true;
	}).then(function(file) {
		var result = {};
		if (file === true) {
			var cached = cache.get(filename);
			result.compiled = cached.compiled;
			result.map = cached.map;
		} else {
			cache.set(result);
			result.compiled = compiler.compile(file, filename, destPath);
			result.map = compiler.getSourceMap();
		}
		return result;
	});
};