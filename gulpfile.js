/**
 * Part of silicone project.
 *
 * @copyright  Copyright (C) 2016 ${ORGANIZATION}.
 * @license    Please see LICENSE file.
 */

var gulp = require("gulp"),//http://gulpjs.com/
	util = require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass = require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer = require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	minifycss = require('gulp-minify-css'),//https://www.npmjs.org/package/gulp-minify-css
	rename = require('gulp-rename'),//https://www.npmjs.org/package/gulp-rename
	log = util.log;

var sassFiles = "src/**/*.scss";
var entryFile = "src/main.scss";


var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var cssmin = require('gulp-cssmin');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var csslint = require('gulp-csslint');
var less = require('gulp-less');

gulp.task("sass", function(){
	log("Generate CSS files " + (new Date()).toString());
	gulp.src(entryFile)
		.pipe(rename('silicone'))
		.pipe(sass({ style: 'expanded' }))
		.pipe(autoprefixer("last 3 version","safari 5", "ie 8", "ie 9"))
		.pipe(gulp.dest("dist"))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist'));
});

gulp.task("watch", function(){
	log("Watching scss files for modifications");
	gulp.watch(sassFiles, ["sass"]);
});

gulp.task("default", ["sass", "watch"]);














gulp.task('default', ['copy'], function() {
    gulp.start(['build-img', 'usemin']);
});

gulp.task('copy', ['clean'], function() {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('build-img', function() {
    gulp.src('dist/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', function() {
    gulp.src('dist/**/*.html')
        .pipe(usemin({
            js : [uglify],
            css : [autoprefixer, cssmin]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('server', function() {
    browserSync.init({
        server : {
            baseDir : 'src'
        }
    });

    gulp.watch('src/js/**/*.js').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(jshint())
            .pipe(jshint.reporter(jshintStylish));
    });

    gulp.watch('src/css/**/*.css').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.reporter());
    });


    gulp.watch('src/less/**/*.less').on('change', function(event) {
        gulp.src(event.path)
            .pipe(less().on('error', function(error) {
                console.log('LESS, erro compilação: ' + error.filename);
                console.log(error.message);
            }))
            .pipe(gulp.dest('src/css'));
    });

    gulp.watch('src/**/*').on('change', browserSync.reload);
});

