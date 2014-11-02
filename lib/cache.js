'use strict';
/* global Promise */

var store = {};
var denodeify = require('denodeify');
var stat = denodeify(require('fs').stat);
var extend = require('util')._extend;

/**
 * Check file exists and is no longer stale;
 * @return {[type]} [description]
 */
module.exports.check = function(filename) {
	if (!store[filename]) return Promise.resolve(false);
	return stat(filename).then (function (stats) {
		if (store[filename].mtime.getTime() > stats.mtime.getTime()) return true;
		return false;
	});
};

module.exports.get = function (filename) {
	return Promise.resolve(store[filename]);
};

module.exports.set = function (filename, data) {
	store[filename] = store[filename] || {};
	extend(store[filename], data);
	store[filename].mtime = new Date();
	return Promise.resolve();
};