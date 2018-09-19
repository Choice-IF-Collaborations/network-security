const gulp = require('gulp');
const sass = require('gulp-sass');
const pump = require('pump');
const nodemon = require('nodemon');
const log = require('fancy-log');

gulp.task('sass', function(cb) {
  return gulp.src('assets/sass/app.scss')
  .pipe(sass({
    style: 'compressed',
  }).on('error', function(err) {
    log(err);
  }))
  .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watch', function() {
  gulp.watch('assets/sass/*.scss', gulp.parallel('sass'));
  nodemon({
    script: 'index.js',
    ext: '',
    ignore: ['public/*'],
  });
});

gulp.task('default', gulp.parallel('sass', 'watch'));

gulp.task('deploy', gulp.parallel('sass'));
