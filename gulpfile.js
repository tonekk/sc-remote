var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    flatten = require('gulp-flatten'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    del = require('del'),
    merge = require('merge-stream'),
    nodemon = require('nodemon')
    sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return cssBundler('./css');
});
gulp.task('build:sass', function() {
  return cssBundler('./dist/css');
});

gulp.task('clean', function(done) {
  del(['./css/*.css', './html/*.html'], done);
});
gulp.task('build:clean', function(done) {
  del(['./dist/*', '!./dist/.keep'], done);
});

gulp.task('build:js', function() {
  var app,
      js;

  js = gulp.src(['./js/*.js'])
    .pipe(gulp.dest('./dist/js/'));
  app = gulp.src(['./app.js', './remood.connection.js'])
    .pipe(gulp.dest('./dist/'));

  return merge(js, app);
});

gulp.task('build:templates', function() {
  return gulp.src(['./blade/*.blade'])
    .pipe(gulp.dest('./dist/blade/'));
});

gulp.task('develop', function () {
  return nodemon({
    script: './app.js',
    nodeArgs: ['--debug=31337']
  })
  .on('restart', function () {
    console.log('Server restarted!');
  });
});

gulp.task('watch', function() {
  return gulp.watch('./sass/**/*.sass', ['sass']);
});

gulp.task('default',
  ['sass', 'watch', 'develop']
);
gulp.task('build',
  ['build:clean', 'build:sass', 'build:js', 'build:templates']
);


function cssBundler(dest) {
return gulp.src('./sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({
      indentedSyntax: true,
      errLogToConsole: true
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(flatten())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
}
