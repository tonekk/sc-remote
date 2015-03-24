var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    del = require('del')
    jade = require('gulp-jade');

gulp.task('sass', function () {
  gulp.src('./sass/*.sass')
    .pipe(sass({
      indentedSyntax: true,
      errLogToConsole: true
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('./css'));
});

gulp.task('jade', function() {
  gulp.src('./jade/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./html'))
});

gulp.task('clean', function(done) {
  del(['./css/*.css', './html/*.html'], done);
});

gulp.task('watch', function() {
  gulp.watch('./sass/*.sass', ['sass']);
  gulp.watch('./jade/*.jade', ['jade']);
});

gulp.task('default', ['sass', 'jade', 'watch']);
