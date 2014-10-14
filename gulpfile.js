var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var connect = require('gulp-connect');
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
	gulp.src('./app/scss/*.scss')
	.pipe(sass({ 
		errLogToConsole: true,
		outputStyle: 'nested',
		sourceComments: 'map'
	}))
	.pipe(gulp.dest('./dist/css'))
	.pipe(connect.reload());
});

gulp.task('connectDev', function () {
	connect.server({
		root: ['dist'],
		port: 8080,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src('./app/*.html')
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});

gulp.task('handlebars', function() {
	gulp.src('./app/templates/**/*.html.hbs')
	.pipe(handlebars())
	.pipe(wrap('Handlebars.template(<%= contents %>)'))
	.pipe(declare({
		namespace: 'Cinder.templates',
			noRedeclare: true,
	}))
	.pipe(concat('_templates.js'))
	.pipe(gulp.dest('./app/js/'));
});

gulp.task('js', function() {
	gulp.src([
		'!./app/js/vendor/*.js',
		'./app/js/cinder/*.js',
		'./app/js/controllers/*.js',
		'./app/js/models/*.js',
		'./app/js/*.js',
		'!./app/js/_templates.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish))
	.pipe(connect.reload());
});

gulp.task('pack', function() {
	gulp.src([
		'./app/js/vendor/*.js',
		'./app/js/cinder/*.js',
		'./app/js/_templates.js',
		'./app/js/controllers/*.js',
		'./app/js/models/*.js',
		'./app/js/*.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('app.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./dist/js/'))
});


gulp.task('release', ['html', 'js', 'pack', 'sass', 'handlebars'], function() {

});

gulp.task('watch', ['release'], function() {
	gulp.watch(['./app/*.html'], ['html']);
	gulp.watch(['./app/templates/**/*.html.hbs'], ['handlebars'])
    gulp.watch(['./app/scss/*.scss', './app/scss/cinder/*.scss', './app/scss/cinder/ui/*.scss'], ['sass']);
    gulp.watch(['./app/js/**/*.js'], ['js', 'pack']);
});


gulp.task('default', ['connectDev', 'watch']);
