'use strict';

var http = require('http'),
    httpProxy = require('http-proxy'),
	options = require('./options.json'),
	forever = require('forever'),
	createHandler = require('github-webhook-handler'),
	handler = createHandler({ path: '/', secret: require('./secret') });

var PORT = options.port || 8080;
var p=process.argv.indexOf('-p');
if(!!~p && process.argv[p+1]) {
	PORT = process.argv[p+1];
}


PORT = parseInt(PORT);
var proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  
  res.end('Something went wrong. And we are reporting a custom error message.\n');
  console.log(err);
});

var jobsArray = require('./jobs.json');
var jobsLength = jobsArray.length;
var content = {};

for (var i=0;i<jobsLength;i++) {
	var item = jobsArray[i];
	forever.startDaemon(item.app);
}

var server = http.createServer(function(req, res) {
	
	// console.log(req.headers.host);

	if (req.headers.host.match(/^githooks/i)) {
		console.log('github webhook redirect', req.url);
		handler(req, res, function (err) {
			res.statusCode = 404;
			res.end('no such location');
  		});	
		return;
	}

	for (var i=0;i<jobsLength;i++) {
		var item = jobsArray[i];
		if (req.headers.host.match(new RegExp(item.pattern))) {
			console.log('redirecting to:', item.target);
			proxy.web(req, res,{ target: item.target });
			return;
		}
	}

	res.writeHead(500, {
		'Content-Type': 'text/plain'
	});
	res.write(JSON.stringify(content));
	res.end('');

});

handler.on('push', function (event) {
	console.log('Received a push event for %s to %s',
	event.payload.repository.name,
	event.payload.ref);
	console.log(event.payload.pusher.modified);
	content = event.payload;
});

console.log("listening on PORT ", PORT);
server.listen(PORT);

