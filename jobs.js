'use strict';

module.exports = [{
	pattern: "^https://(www\\.)?1am\\.club/~([a-z1-9]+)/?(.*)",
	type: "static",
	target: "/home/{{2}}/public_html/",
	rewriteURL: "/{{3}}",
	comment: "Users public_html dir",
	https: true
},{
	pattern: "^http://(.*)",
	type: "redirect",
	target: "https://{{1}}",
	comment: "Redirect http to https"
},{
	type: "self-update",
	deploy: {
			watch: "https://github.com/AdaRoseEdwards/1am-proxy",
			ref: "refs/heads/master",
			run: "npm install",
			folder: __dirname
	}
}];
