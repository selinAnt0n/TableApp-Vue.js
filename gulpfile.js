var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	browSync = require('browser-sync'),
	imagemin = require('gulp-imagemin'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename');


gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('app/css'))
	.pipe(browSync.reload({stream: true}))
});
gulp.task('concat', function() {
	return gulp.src('app/jsOther/**/*.js')
	.pipe(concat('global.js'))
	.pipe(gulp.dest('app/js'))
	.pipe(browSync.reload({stream: true}))
});

gulp.task('minicss', function () {
    gulp.src('app/css/global.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('imgmin', function () {
    gulp.src('app/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});

gulp.task('sync', function() {

	browSync({
		server:{
			baseDir: 'app'
		},
		notify: false
	});
});
gulp.task('watch', ['sync', 'sass'] , function() {
	gulp.watch('app/sass/**/*.scss' , ['sass']);
	gulp.watch('app/jsOther/**/*.js' , ['concat']);
	gulp.watch('app/*.html', browSync.reload);	
});
