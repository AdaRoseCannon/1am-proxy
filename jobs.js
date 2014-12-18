'use strict';

var basePattern = "//(www\\.)?1am\\.club(:\\d+)?/";
var httpsBP = "^https:" + basePattern;
var httpBP = "^http:" + basePattern;


module.exports = [{
	pattern: "^https://ada\\.is/",
	type: "static",
	target: "/home/ada/ada.is",
	https: true,
	comment: "Point ada.is to my local public_html"
},{
	pattern: "^http://ada\\.is/(.*)",
	type: "redirect",
	target: "https://ada.is/{{1}}",
	comment: "Redirect http to https"
},{
	pattern: httpsBP + "~([a-z1-9]+)/(.*)",
	type: "static",
	target: "/home/{{3}}/public_html/",
	rewriteURL: "/{{4}}",
	https: true,
	comment: "Users public_html dir"
},{
	pattern: httpsBP + "~([a-z1-9]+)$",
	type: "redirect",
	target: "https://{{1}}1am.club{{2}}/~{{3}}/",
	https: true,
	comment: "Redirect ~ada to ~ada/"
},{
	pattern: httpBP + "(.*)",
	type: "redirect",
	target: "https://{{1}}1am.club{{2}}/{{3}}",
	comment: "Redirect http to https"
},{
	type: "self-update",
	deploy: {
		watch: "https://github.com/AdaRoseEdwards/1am-proxy",
		ref: "refs/heads/master",
		run: "npm install",
		folder: (function (d) {
			console.log('Watching "' + d + '" for updates');
			return d + '/';
		})(__dirname)
	},
	comment: "Update the app when a push is recieved to master"
},{
	type: "return",
	pattern: httpsBP + "t/~([a-z1-9]+)/(.*\\.js)",
	target: "/home/{{3}}/public_html/",
	rewriteURL: "/{{4}}",
	https: true,
	transpile: true,
	comment: "Transpiling custom endpoint"
},{
	type: "proxy",
	pattern: httpsBP,
	target: "https://localhost:8444",
	comment: "Proxy all remaining requests to the website",
	https: true,g
	deploy: {
		watch: "https://github.com/AdaRoseEdwards/1am-main",
		ref: "refs/heads/master",
		run: "npm install; pkill -f 1am-main",
		folder: "/home/www/1am-main/"
	}
}];
