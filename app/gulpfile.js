var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    reactify = require('reactify'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify');

var path = {
  OUT: 'bundle.js',
  DEST: './public/js',
  ENTRY_POINT: './client/main.js'
}

gulp.task('browserify', function () {
  return browserify(path.ENTRY_POINT)
    .bundle()
    .pipe(source(path.OUT))  // gives streaming vinyl file object
    .pipe(buffer())          // convert from streaming to buffered vinyl file object
    .pipe(uglify())          // minify dat code
    .pipe(gulp.dest(path.DEST));
});

gulp.task('dev', function () {
  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST))
  }).bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST));
});