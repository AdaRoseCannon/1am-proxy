'use strict';
/* global Promise */

var denodeify = require('denodeify');
var readFile = denodeify(require('fs').readFile);
var Traceur = require('traceur').NodeCompiler;
var destPath = '/tmp/out.js';
var cache = require('./cache');

var compiler = new Traceur({
	sourceMaps: true,
	modules: 'commonjs'
});

module.exports = function compile(filename) {
	return cache.check(filename).then(function(cached) {
		if (!cached) return readFile(filename, {encoding: 'utf8'});
		return true;
	}).then(function(file) {
		return new Promise(function (resolve) {
			if (file === true) {
				cache.get(filename).then(function (cached) {
					resolve({
						compiled: cached.compiled,
						map: cached.map
					});
				});
			} else {
				var result = {};
				result.compiled = compiler.compile(file, filename, destPath);
				result.map = compiler.getSourceMap();
				cache.set(filename, result).then(function () {
					resolve(result);
				});
			}
		});
	});
};