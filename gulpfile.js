// Include gulp
var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    replace = require('gulp-replace'),
    uglify = require("gulp-uglify")

// Clean
gulp.task("clean-debug", function () {
    return del(['debug/contact.json',
        'debug/web.config',
        'debug/*.html',
        'debug/lib/*',
        'debug/js/*',
        'debug/css/*',
        'debug/images/*'
    ]);
});
// Debug: Copy the html, cache, and web.config
gulp.task("build-html-debug", function () {
    gulp.src(['./*.html',
        './web.config',
        'contact.json',
        './favicon.ico'])
        .pipe(gulp.dest('./debug'));
});
// Deploy: Copy the html, cache, Json files, and web.config
gulp.task("build-html", function () {
    gulp.src(['./*.html',
        './web.config',
        'contact.json',
        './favicon.ico'])
        .pipe(gulp.dest('./deploy'));
});
// Debug: Copy the images
gulp.task("build-images-debug", function () {
    gulp.src('./images/*')
        .pipe(gulp.dest('./debug/images'));
});
// Deploy: Copy the images
gulp.task("build-images", function () {
    gulp.src('./images/*')
        .pipe(gulp.dest('./deploy/images'));
});
// Debug: Copy the JS
gulp.task('build-js-debug', function () {
    gulp.src('./js/*.js')
        .pipe(gulp.dest('./debug/js/'));
});
// Debug: Copy the JS libs
gulp.task('build-jslib-debug', function () {
    gulp.src('./lib/bootstrap/dist/js/bootstrap.js')
        .pipe(gulp.dest('./debug/lib/bootstrap'));
    gulp.src('./lib/jquery/dist/jquery.js')
        .pipe(gulp.dest('./debug/lib/jquery'));
    gulp.src('./lib/handlebars/handlebars.js')
        .pipe(gulp.dest('./debug/lib/handlebars'));
    gulp.src('./lib/moment/moment.js')
        .pipe(gulp.dest('./debug/lib/moment'));
    gulp.src('./lib/jQuery-contextMenu/dist/jquery.ContextMenu.js')
        .pipe(gulp.dest('./debug/lib/jQuery-contextMenu'));
});
// Deploy: Minify JS
gulp.task('build-js', function () {
    gulp.src('./js/main.js')
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('./deploy/js/'));
    gulp.src('./js/jquery.js')
        .pipe(uglify())
        .pipe(concat('jquery.min.js'))
        .pipe(gulp.dest('./deploy/js/'));
});
// Debug: Copy the CSS
gulp.task('build-css-debug', function () {
    gulp.src('./css/*.css')
        .pipe(gulp.dest('./debug/css/'));
});
// Debug: Copy the CSS libs
gulp.task('build-csslib-debug', function () {
    gulp.src('./lib/bootstrap/dist/css/bootstrap.css')
        .pipe(gulp.dest('./debug/lib/bootstrap'));
    gulp.src('./lib/jQuery-contextMenu/dist/jquery.contextMenu.css')
    .pipe(gulp.dest('./debug/lib/jQuery-contextMenu'));
});
// Deploy: Minify the CSS
gulp.task('build-css', function () {
    gulp.src('./css/*.css')
        .pipe(minifyCss())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('./deploy/css/'));
});