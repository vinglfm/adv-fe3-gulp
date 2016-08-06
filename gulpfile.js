var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var path = require('path');
var args = require('yargs').args;
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');
var cssComb = require('gulp-csscomb');
var runSequence = require('run-sequence');
var join = path.join;

var dest = 'bin';

gulp.task('copy:images', function() {
  return gulp.src('images/**/*.{png,jpeg,svg}')
      .pipe(gulp.dest(join(dest, 'images')));
});

gulp.task('copy:js', function() {
  return gulp.src('js/**/*.js')
      .pipe(gulp.dest(join(dest, 'js')));
});

gulp.task('copy:html', function() {
  return gulp.src('*.html')
      .pipe(gulp.dest(dest));
});

gulp.task('copy-static', ['copy:images', 'copy:js', 'copy:html']);

gulp.task('css', function() {
  return gulp.src('styles/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.css'))
    .pipe(less())
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
});

gulp.task('csscomb', function() {
    return gulp.src('styles/**/*.less')
      .pipe(cssComb().on('error', handleErrors))
      .pipe(gulp.dest(function(file) {
        return file.base;
      }));
});

gulp.task('style', function() {
  runSequence('csscomb');
});

gulp.task('default', ['copy-static', 'css']);

gulp.task('watch', function () {
      gulp.watch('*.html', ['copy:html']);
      gulp.watch('styles/**/*.less', ['css']);
      gulp.watch('images/**/*.{png,jpeg,svg}', ['copy:images']);
      gulp.watch('js/**/*.js', ['copy:js'])
});

function handleErrors(err) {
  console.log(err.toString());
  this.emit('end');
  return this;
}
