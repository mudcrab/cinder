var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

gulp.task('sass', function () {
	gulp.src('./app/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./css'));
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
    gulp.watch('scss/*.scss', ['sass']);
});


gulp.task('default', ['connectDev', 'watch']);
