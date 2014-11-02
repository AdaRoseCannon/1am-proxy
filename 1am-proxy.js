'use strict';

var PeerServer = require('peer').PeerServer;
var path = require('path');
var compile = require('./lib/compiler');
require('es6-promise').polyfill();

var options = {
	port: 8080,
	https_port: 8443,
	noAppcache: true,
	spdy: true,
	ssl_options: require('/home/ada/keys/keys_config.js'),
	gitHooks: {
		url: "^https:\/\/1am\\.club/gh/$", //If the url begins with http://githooks then it is a git hook,
		secret: require('./secret'),
		path: "/gh/"
	}
};


(function () {
	var p=process.argv.indexOf('-p');
	if(!!~p && process.argv[p+1]) {
		options.port = process.argv[p+1];
	}

	var s=process.argv.indexOf('-s');
	if(!!~s && process.argv[s+1]) {
		options.https_port = process.argv[s+1];
	}

	options.https_port = parseInt(options.https_port);
	options.port = parseInt(options.port);
})();

var proxy = require('ada-proxy-core') (options, require('./jobs.js'));
proxy.on('updated', function (item) {
	if (item.type === "self-update") {
		console.log('Recieved an update signal exiting.');
		process.exit();
	}
}).on('return', function (req, res, item) {
	if (item.transpile) {
		var filePath = path.normalize(path.join(item.target, item.url));
		compile(filePath)
		.then(function (result) {
			res.end(result);
		}).catch(function (err) {
			res.setHeader(500);
			res.end(err);
		});
	}
	console.log(item);
	res.end(item);
});

new PeerServer({
	port: 9000,
	ssl: options.ssl_options,
	path: '/'
});
