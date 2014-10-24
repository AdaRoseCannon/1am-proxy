'use strict';

var constants = require('constants');
var fs = require('fs');

var options = {
	port: 8080,
	https_port: 8443,
	gitSecret: require('./secret'),
	forbidAppcache: true,
	ssl_options: {
		// This is the default secureProtocol used by Node.js, but it might be
		// sane to specify this by default as it's required if you want to
		// remove supported protocols from the list. This protocol supports:
		//
		// - SSLv2, SSLv3, TLSv1, TLSv1.1 and TLSv1.2
		//
		secureProtocol: 'SSLv23_method',

		// Supply `SSL_OP_NO_SSLv3` constant as secureOption to disable SSLv3
		// from the list of supported protocols that SSLv23_method supports.
		//
		secureOptions: constants.SSL_OP_NO_SSLv3,
		key: fs.readFileSync("/home/ada/keys/ssl.key"),
		cert: fs.readFileSync("/home/ada/keys/ssl.crt"),
		ca: [
			fs.readFileSync("/home/ada/keys/ca.pem"),
			fs.readFileSync("/home/ada/keys/sub.class1.server.ca.pem")
		]
	},
	githookURL: "^http:\/\/githooks", //If the url begins with http://githooks then it is a git hook
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

var proxy = require('ada-proxy-core') (options, require('./jobs.json'));
proxy.on('updated', function (item) {
	if (item.type === "self-update") {
		console.log('Recieved an update signal exiting.');
		process.exit();
	}
});