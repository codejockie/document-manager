import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import jasmineNode from 'gulp-jasmine-node';
import istanbul from 'gulp-istanbul';
import injectModules from 'gulp-inject-modules';
import exit from 'gulp-exit';

process.env.NODE_ENV = 'test';

gulp.task('watch', () => {
  nodemon({
    script: 'build/server.js',
    ext: 'js',
    ignore: ['README.md', 'node_modules/**', '.DS_Store', 'LICENSE', '.*.yml'],
    watch: ['server']
  });
});

gulp.task('build', () => gulp.src('server/**/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-0']
  }))
  .pipe(gulp.dest('build')));

gulp.task('test', (done) => {
  gulp.src(['build/routes/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('./tests/**/*.js')
        .pipe(babel())
        .pipe(injectModules())
        .pipe(jasmineNode())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
        .on('end', done)
        .pipe(exit());
    });
});

gulp.task('default', ['build', 'watch'], () => {
  gulp.watch('server/**/*.js', ['build']);
});
