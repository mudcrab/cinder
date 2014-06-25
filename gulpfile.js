var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

gulp.task('sass', function () {
	gulp.src('./app/scss/*.scss')
		.pipe(sass({ 
			errLogToConsole: true,
			outputStyle: 'nested'
		}))
		.pipe(gulp.dest('./app/css'))
		.pipe(connect.reload());
});

gulp.task('connectDev', function () {
	connect.server({
		root: ['app'],
		port: 8080,
		livereload: true
	});
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(['./app/*.html'], ['html']);
    gulp.watch(['./app/scss/*.scss', './app/scss/cinder/*.scss'], ['sass']);
});


gulp.task('default', ['connectDev', 'watch']);
