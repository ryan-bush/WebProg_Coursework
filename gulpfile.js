var gulp = require('gulp');
var browserSync = require('browser-sync').create(); // create a browser sync instance.

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        proxy: "http://localhost:8080",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});