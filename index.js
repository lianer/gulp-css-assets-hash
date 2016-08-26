'use strict';

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var gutil = require('gulp-util');
var through = require('through2');
var URI = require('urijs');

function sha1(filepath) {
	try{
		var file = fs.readFileSync(filepath);
		return crypto.createHash('md5').update(file).digest('hex').slice(-7);
	}catch(e){
		console.warn(`[gulp-css-assets-hash] file ${filepath} not found`);
		return '';
	}
}

module.exports = function (options) {
	var reg = /(url\(['"]?)(.+?\.(?:png|jpg|gif))(.*?)(['"]?\))/igm;
	var contents;
	var uri;
	var cssDir;

	return through.obj(function (file, enc, callback) {
		cssDir = path.dirname(file.path);

		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-css-assets-hash', 'Streams are not supported!'));
			return callback();
		}

		contents = file.contents.toString().replace(reg, function (content, left, filepath, query, right) {
			uri = new URI(filepath + query);
			if(!uri.is('relative')){
				return content;
			}

			uri.setQuery("_", sha1(path.join(cssDir, filepath)));
			return left + uri.toString() + right;
		});

		file.contents = new Buffer(contents);

		this.push(file);
		return callback();
	})
};