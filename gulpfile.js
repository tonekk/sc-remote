var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    slim = require('gulp-slim');

gulp.task('styles', function() {
  var s = sass('sass/', { style: 'expanded' });
  s.on('error', function(e) {
    gutil.log(e);
  });

  return s
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('css'))
});

gulp.task('slim', function(){

  var s = slim({ pretty: true });
  s.on('error', function(e) {
    gutil.log(e);
  });

  gulp.src("slim/*.slim")
    .pipe(s)
    .pipe(gulp.dest("html/"));
});

gulp.task('watch', function() {
  gulp.watch('sass/*.sass', ['styles']);
  gulp.watch('slim/*.slim', ['slim']);
});

gulp.task('default', ['watch']);
