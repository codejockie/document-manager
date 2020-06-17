import gulp from 'gulp';
import babel from 'gulp-babel';

const compile = (cb) => {
  gulp.src('server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
  cb();
};

const compileTest = (cb) => {
  gulp.src('__tests__/server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/__tests__'));
  cb();
};

exports.build = gulp.series(gulp.parallel(compile, compileTest));
