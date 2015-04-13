var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    flatten = require('gulp-flatten'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    del = require('del'),
    nodemon = require('nodemon');

gulp.task('sass', function () {
  gulp.src('./sass/**/*.sass')
    .pipe(sass({
      indentedSyntax: true,
      errLogToConsole: true
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(flatten())
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

gulp.task('watch', function() {
  gulp.watch('./sass/**/*.sass', ['sass']);
});

gulp.task('clean', function(done) {
  del(['./css/*.css', './html/*.html'], done);
});


gulp.task('default',
  ['sass', 'watch', 'develop']
);

gulp.task('build',
  ['clean', 'sass']
);
