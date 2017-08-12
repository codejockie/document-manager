import gulp from 'gulp';
import babel from 'gulp-babel';
import exit from 'gulp-exit';
import injectModules from 'gulp-inject-modules';
import istanbul from 'gulp-istanbul';
import jasmine from 'gulp-jasmine';
import nodemon from 'gulp-nodemon';

gulp.task('compile', () => gulp.src('server/**/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-0']
  }))
  .pipe(gulp.dest('src')));

gulp.task('test', ['compile'], (done) => {
  gulp.src(['src/controllers/*.js', 'src/helpers/*.js', 'src/middleware/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('./tests/**/*.js')
        .pipe(babel())
        .pipe(injectModules())
        .pipe(jasmine({
          verbose: true
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 85 } }))
        .on('end', done)
        .pipe(exit());
    });
});

gulp.task('watch', ['compile'], () => {
  nodemon({
    script: 'src/server.js',
    ext: 'js',
    env: { NODE_ENV: 'development' },
    ignore: ['README.md', 'node_modules/**', '.DS_Store', 'LICENSE', '.*.yml'],
    tasks: ['compile'],
    watch: ['server']
  });
});
