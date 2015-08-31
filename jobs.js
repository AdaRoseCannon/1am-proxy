'use strict';

module.exports = [{
	pattern: "^http://(www\\.)?(1am|ada)\\.",
	type: "middleware",
	middleware: function (req, res) {
  		res.statusCode = 301;
		res.setHeader('Location', 'https://' + req.headers.host.split(':')[0] + req.url);
		res.setHeader('Strict-Transport-Security', 'max-age=31536000;');
		res.end();
	},
	comment: "HSTS Web Endpoints for ada.is and 1am.club"
},{
	pattern: "^https://(www\\.)?ada\\.is/",
	type: "static",
	target: "/home/ada/ada.is",
	https: true,
	comment: "Point ada.is to my ada.is folder"
},{
	pattern: "^https://1am\\.club(.*)",
	type: "redirect",
	target: "https://www.1am.club{{1}}",
	https: true,
	comment: "Redirect through www so that it runs through cloudflare"
},{
	pattern: "^https://www\\.1am\\.club/~([a-z1-9]+)/(.*)",
	type: "static",
	target: "/home/{{1}}/public_html/",
	rewriteURL: "/{{2}}",
	https: true,
	comment: "Users public_html dir"
},{
	type: "self-update",
	deploy: {
		watch: "https://github.com/AdaRoseEdwards/1am-proxy",
		ref: "refs/heads/master",
		run: "npm install; pkill -f 1am-proxy",
		folder: (function (d) {
			console.log('Watching "' + d + '" for updates');
			return d + '/';
		})(__dirname)
	},
	comment: "Update the app when a push is recieved to master"
},{
	type: "return",
	pattern: "^https://www\\.1am\\.club/t/~([a-z1-9]+)/(.*\\.js)$",
	target: "/home/{{1}}/public_html/",
	rewriteURL: "/{{2}}",
	https: true,
	transpile: true,
	comment: "Transpiling custom endpoint"
},{
	type: "proxy",
	pattern: "^https:",
	target: "https://localhost:8444",
	comment: "Proxy all remaining requests to the website",
	https: true,
	deploy: {
		watch: "https://github.com/AdaRoseEdwards/1am-main",
		ref: "refs/heads/master",
		run: "npm install; pkill -f 1am-main",
		folder: "/home/www/1am-main/"
	}
}];
