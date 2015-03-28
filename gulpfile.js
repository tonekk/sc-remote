var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    del = require('del'),
    nodemon = require('nodemon');

gulp.task('sass', function () {
  gulp.src('./sass/*.sass')
    .pipe(sass({
      indentedSyntax: true,
      errLogToConsole: true
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('./css'));
});

gulp.task('develop', function () {
  nodemon({
    script: './app.js',
    nodeArgs: ['--debug=31337']
  })
  .on('restart', function () {
    console.log('Server restarted!')
  })
});

gulp.task('clean', function(done) {
  del(['./css/*.css', './html/*.html'], done);
});

gulp.task('watch', function() {
  gulp.watch('./sass/*.sass', ['sass']);
});

gulp.task('default', ['sass', 'watch', 'develop']);
