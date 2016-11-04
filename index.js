var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var through = require('through2')
var URI = require('urijs')

function sha1(cssdir, imgurl, filepath) {
	try{
		var file = fs.readFileSync(path.join(cssdir, imgurl))
		return crypto.createHash('md5').update(file).digest('hex').slice(-7)
	}catch(e){
		console.warn('[gulp-css-assets-hash] image ' + imgurl + ' is not found at ' + filepath)
		return ''
	}
}

module.exports = function (options) {
	var reg = /(url\(['"]?)([^\)\"\']+?\.(?:png|jpg|gif|svg))([^\)\"\']*?)(['"]?\))/igm

	return through.obj(function (file, enc, callback) {
		var filepath = file.path
		var cssdir = path.dirname(file.path)

		if (file.isNull()) {
			this.push(file)
			return callback()
		}

		if (file.isStream()) {
			console.error('[gulp-css-assets-hash] Streams are not supported!')
			return callback()
		}

		var contents = file.contents.toString().replace(reg, function (content, left, imgurl, query, right) {
			var uri = new URI(imgurl + query)
			if(!uri.is('relative')){
				return content
			}
			var hash = sha1(cssdir, imgurl, filepath)
			uri.setQuery('_', hash)
			return left + uri.toString() + right
		})

		file.contents = new Buffer(contents)

		this.push(file)
		return callback()
	})
}
