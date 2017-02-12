var gulp = require('gulp'),
	nodemon = require('gulp-nodemon');


gulp.task('default', function (cb) {
	nodemon({
		script: './bin/www',
		ext: '*'
	});
});