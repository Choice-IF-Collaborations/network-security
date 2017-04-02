var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pug = require('gulp-pug');

gulp.task('default', ['sass', 'nodemon', 'watch']);
gulp.task('deploy', ['sass']);

gulp.task('watch', function() {
  gulp.watch('assets/sass/*.scss', ['sass']);
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'index.js',
    ext: 'js md yaml'
  });
});

gulp.task('sass', function() {
  gulp.src('assets/sass/app.scss')
  .pipe(sass({ outputStyle: 'compressed' }))
    .on('error', gutil.log)
  .pipe(gulp.dest('public/stylesheets'))
});
