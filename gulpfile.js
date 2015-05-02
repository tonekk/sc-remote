var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    flatten = require('gulp-flatten'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    del = require('del'),
    merge = require('merge-stream'),
    nodemon = require('nodemon')
    sourcemaps = require('gulp-sourcemaps'),
    bower = require('gulp-bower');

gulp.task('sass', function () {
  return cssBundler('./assets/css');
});
gulp.task('build:sass', function() {
  return cssBundler('./dist/assets/css');
});

gulp.task('clean', function(done) {
  del(['./assets/css/*.css'], done);
});
gulp.task('build:clean', function(done) {
  del(['./dist/*', '!./dist/.keep'], done);
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./assets/vendor'));
});
gulp.task('build:bower', function() {
  return bower()
    .pipe(gulp.dest('./dist/assets/vendor'));
});

gulp.task('build:js', function() {
  var app,
      js;

  js = gulp.src(['./assets/js/*.js'])
    .pipe(gulp.dest('./dist/assets/js'));
  app = gulp.src(['./app.js'])
    .pipe(gulp.dest('./dist'));

  return merge(js, app);
});

gulp.task('build:templates', function() {
  return gulp.src(['./assets/blade/**/*.blade'])
    .pipe(gulp.dest('./dist/assets/blade/'));
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
  return gulp.watch('./assets/sass/**/*.sass', ['sass']);
});

gulp.task('default',
  ['sass', 'bower', 'watch', 'develop']
);
gulp.task('build',
  ['build:clean', 'build:sass', 'build:js', 'build:templates', 'build:bower']
);


function cssBundler(dest) {
return gulp.src('./assets/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({
      indentedSyntax: true,
      errLogToConsole: true,
      includePaths: ['./assets/vendor']
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(flatten())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
}
