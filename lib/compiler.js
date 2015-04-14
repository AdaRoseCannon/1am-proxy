'use strict';
/* globals Promise */
var browserify = require('browserify');
var es6ify = require('es6ify');

function compilePromise(file, stream) {
	return new Promise(function (resolve) {

	    stream.on('finish', function () {
	    	resolve(file);
	    });

		browserify({ debug: true })
			.add(es6ify.runtime)
			.transform(es6ify)
			.require(require.resolve(file), { entry: true })
			.bundle()
			.on('error', function(err){
				// print the error (can replace with gulp-util)
				console.log("browserify error", err.message);
				// end this stream
				this.emit('end');
			})
			.pipe(stream);
	});
}

module.exports = function transpile(path, res) {
	return compilePromise(path, res)
		.then(function () {
			console.log('Compiled', path);
		})
		.catch(function (err) {
			console.log('Transpiling Err', err);
			res.writeHead(500, {
				'Content-Type': 'text/plain'
			});
			res.write(err.message);
			res.end();
		});
};