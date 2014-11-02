'use strict';
/* global Promise */

var store = {};
var denodeify = require('denodeify');
var stat = denodeify(require('fs').stat);
var exists = denodeify(require('fs').exists);

/**
 * Check file exists and is no longer stale;
 * @return {[type]} [description]
 */
module.exports.check = function(filename) {
	return exists(filename)
	.then(function (exists) {
		if (exists) return store[filename].mtime;
		return false;
	}).then (function (mtime) {
		if(mtime) return stat(filename);
		return false;
	}).then (function (stats) {
		if (stats && store[filename].mtime.getTime() > stats.mtime.getTime()) return true;
		return false;
	});
};

module.exports.get = function (filename) {
	return store[filename];
};

module.exports.set = function (filename, data) {
	store[filename] = data;
	store[filename].mtime = new Date();
};