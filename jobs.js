'use strict';

module.exports = [{
	pattern: "^https://(www\\.)?1am\\.club/~([a-z1-9]+)/(.*)",
	type: "static",
	target: "/home/{{2}}/public_html/",
	rewriteURL: "/{{3}}",
	https: true,
	comment: "Users public_html dir"
},{
	pattern: "^https://(www\\.)?1am\\.club/~([a-z1-9]+)$",
	type: "redirect",
	target: "https://{{1}}1am.club/~{{2}}/",
	https: true,
	comment: "Redirect ~ada to ~ada/"
},{
	pattern: "^http://(www\\.)?1am\\.club/(.*)",
	type: "redirect",
	target: "https://{{1}}1am.club/{{2}}",
	comment: "Redirect http to https"
},{
	type: "self-update",
	deploy: {
		watch: "https://github.com/AdaRoseEdwards/1am-proxy",
		ref: "refs/heads/master",
		run: "npm install",
		folder: __dirname
	},
	comment: "Update the app when a push is recieved to master"
},{
	type: "return",
	pattern: "^https://(www\\.)?1am\\.club/t/~([a-z1-9]+)/(.*\\.js)",
	target: "/home/{{2}}/public_html/",
	rewriteURL: "/{{3}}",
	https: true,
	transpile: true,
	comment: "Transpiling custom endpoint"
},{
	type: "proxy",
	pattern: "^https://(www\\.)?1am\\.club/",
	target: "https://localhost:8444",
	comment: "Proxy all remaining requests to the website",
	https: true,
	deploy: {
		watch: "https://github.com/AdaRoseEdwards/1am-main",
		ref: "refs/heads/master",
		run: "npm install",
		folder: "/home/ada/gitWorkingDir/1am-main/"
	}
}];
