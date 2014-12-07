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
var combine = require('stream-combiner');

gulp.task('sass', function () {
	gulp.src('./app/scss/**/*.scss')
	.pipe(sass({ 
		errLogToConsole: true,
		outputStyle: 'nested',
		sourceComments: 'map'
	}))
	.pipe(gulp.dest('./dist/css'))
	.pipe(connect.reload());
});

gulp.task('sass-release', function () {
	gulp.src('./app/scss/*.scss')
	.pipe(sass({ 
		errLogToConsole: true,
		outputStyle: 'compressed',
		sourceComments: 'none'
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
	gulp.src('./app/templates/**/*.hbs')
	.pipe(handlebars())
	.pipe(wrap('Handlebars.template(<%= contents %>)'))
	.pipe(declare({
		namespace: 'Tpl',
			noRedeclare: true,
	}))
	.pipe(concat('templates.js'))
	.pipe(gulp.dest('./dist/js/'))
	.pipe(connect.reload());
});

gulp.task('vendor', function() {
	/*gulp.src([
		
	], { cwd: 'node_modules' })
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('./dist/js/'));*/
});

gulp.task('js', function() {
	gulp.src([
		'./app/js/**/*.js',
		'!./app/js/vendor/*.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish))
	.pipe(connect.reload());
});

gulp.task('pack', function() {
	gulp.src([
		
	])
	.pipe(sourcemaps.init())
	.pipe(concat('app.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./dist/js/'))
});

gulp.task('pack-release', function() {
	gulp.src([
		
	])
	.pipe(concat('app.js'))
	.pipe(gulp.dest('./dist/js/'))
});

gulp.task('release', ['html', 'vendor', 'js', 'pack-release', 'sass-release', 'handlebars'], function() {

});

gulp.task('watch', [], function() {
	watch(['app/*.html'], function() {
		gulp.start( 'html' );
	});

	watch(['app/scss/**/*.scss'], function() {
		gulp.start( 'sass' );
	});

	watch(['app/templates/**/*.hbs'], function() {
		gulp.start( 'handlebars' );
	});

	watch(['app/js/**/*.js'], function() {
		gulp.start( 'js' );
		gulp.start( 'pack' );
	});
});

gulp.task('default', ['connectDev', 'watch']);