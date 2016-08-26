var gulp = require('gulp');
var hash = require('../index');
var rename = require('gulp-rename')

gulp.task('default', function () {
	gulp.src('a.css')
		.pipe(hash())
		.pipe(rename('b.css'))
		.pipe(gulp.dest('./'));
})