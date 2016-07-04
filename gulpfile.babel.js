'use strict';

import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import grunt from 'grunt';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import open from 'open';
import lazypipe from 'lazypipe';
import {
  stream as wiredep
} from 'wiredep';
import nodemon from 'nodemon';
import runSequence from 'run-sequence';

var plugins = gulpLoadPlugins();
var config;

const clientPath = require('./bower.json').appPath || 'client';
const serverPath = 'server';
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    scripts: [
            `${clientPath}/**/!(*.spec|*.mock).js`,
            `!${clientPath}/bower_components/**/*`
        ],
    styles: [`${clientPath}/{app,components}/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    views: `${clientPath}/{app,components}/**/*.html`,
    mainView: `${clientPath}/index.html`,
    test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
    e2e: ['e2e/**/*.spec.js'],
    bower: `${clientPath}/bower_components/`
  },
  server: {
    scripts: [
          `${serverPath}/**/!(*.spec|*.integration).js`,
          `!${serverPath}/config/local.env.sample.js`
        ],
    json: [`${serverPath}/**/*.json`]
  },
  dist: 'dist'
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
  console.log(plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message);
}

function checkAppReady(cb) {
  var options = {
    host: 'localhost',
    port: config.port
  };
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
  var serverReady = false;
  var appReadyInterval = setInterval(() =>
    checkAppReady((ready) => {
      if (!ready || serverReady) {
        return;
      }
      clearInterval(appReadyInterval);
      serverReady = true;
      cb();
    }),
    100);
}

function sortModulesFirst(a, b) {
  var module = /\.module\.js$/;
  var aMod = module.test(a.path);
  var bMod = module.test(b.path);
  // inject *.module.js first
  if (aMod === bMod) {
    // either both modules or both non-modules, so just sort normally
    if (a.path < b.path) {
      return -1;
    }
    if (a.path > b.path) {
      return 1;
    }
    return 0;
  } else {
    return (aMod ? -1 : 1);
  }
}

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()
  .pipe(plugins.jshint, `${clientPath}/.jshintrc`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerScripts = lazypipe()
  .pipe(plugins.jshint, `${serverPath}/.jshintrc`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerTestScripts = lazypipe()
  .pipe(plugins.jshint, `${serverPath}/.jshintrc-spec`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let styles = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.sass)

.pipe(plugins.autoprefixer, {
    browsers: ['last 1 version']
  })
  .pipe(plugins.sourcemaps.write, '.');

let transpileClient = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel)
  .pipe(plugins.sourcemaps.write, '.');

let transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: [
            'transform-class-properties',
            'transform-runtime'
        ]
  })
  .pipe(plugins.sourcemaps.write, '.');

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
  let localConfig;
  try {
    localConfig = require(`./${serverPath}/config/local.env`);
  } catch (e) {
    localConfig = {};
  }
  plugins.env({
    vars: localConfig
  });
});
gulp.task('env:test', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});
gulp.task('env:prod', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'production'
    }
  });
});

/********************
 * Tasks
 ********************/

gulp.task('inject', cb => {
  runSequence(['inject:js', 'inject:css', 'inject:scss'], cb);
});

gulp.task('inject:js', () => {
  return gulp.src(paths.client.mainView)
    .pipe(plugins.inject(
      gulp.src(_.union(paths.client.scripts, [`!${clientPath}/**/*.{spec,mock}.js`, `!${clientPath}/app/app.js`]), {
        read: false
      })
      .pipe(plugins.sort(sortModulesFirst)), {
        starttag: '<!-- injector:js -->',
        endtag: '<!-- endinjector -->',
        transform: (filepath) => '<script src="' + filepath.replace(`/${clientPath}/`, '') + '"></script>'
      }))
    .pipe(gulp.dest(clientPath));
});

gulp.task('inject:css', () => {
  return gulp.src(paths.client.mainView)
    .pipe(plugins.inject(
      gulp.src(`${clientPath}/{app,components}/**/*.css`, {
        read: false
      })
      .pipe(plugins.sort()), {
        starttag: '<!-- injector:css -->',
        endtag: '<!-- endinjector -->',
        transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace(`/${clientPath}/`, '').replace('/.tmp/', '') + '">'
      }))
    .pipe(gulp.dest(clientPath));
});

gulp.task('inject:scss', () => {
  return gulp.src(paths.client.mainStyle)
    .pipe(plugins.inject(
      gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {
        read: false
      })
      .pipe(plugins.sort()), {
        transform: (filepath) => {
          let newPath = filepath
            .replace(`/${clientPath}/app/`, '')
            .replace(`/${clientPath}/components/`, '../components/')
            .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
            .replace('.scss', '');
          return `@import '${newPath}';`;
        }
      }))
    .pipe(gulp.dest(`${clientPath}/app`));
});

gulp.task('styles', () => {
  return gulp.src(paths.client.mainStyle)

  .pipe(styles())
    .pipe(gulp.dest('.tmp/app'));
});

gulp.task('transpile:client', () => {
  return gulp.src(paths.client.scripts)
    .pipe(transpileClient())
    .pipe(gulp.dest('.tmp'));
});

gulp.task('transpile:server', () => {
  return gulp.src(_.union(paths.server.scripts, paths.server.json))
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
  return gulp.src(_.union(
      paths.client.scripts,
      _.map(paths.client.test, blob => '!' + blob), [`!${clientPath}/app/app.constant.js`]
    ))
    .pipe(lintClientScripts());
});

gulp.task('lint:scripts:server', () => {
  return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
    .pipe(lintServerScripts());
});

gulp.task('lint:scripts:clientTest', () => {
  return gulp.src(paths.client.test)
    .pipe(lintClientScripts());
});

gulp.task('lint:scripts:serverTest', () => {
  return gulp.src(paths.server.test)
    .pipe(lintServerTestScripts());
});

gulp.task('jscs', () => {
  return gulp.src(_.union(paths.client.scripts, paths.server.scripts))
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {
  dot: true
}));

gulp.task('start:client', cb => {
  whenServerReady(() => {
    open('http://localhost:' + config.port);
    cb();
  });
});

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} ${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./${paths.dist}/${serverPath}/config/environment`);
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('start:inspector', () => {
  gulp.src([])
    .pipe(plugins.nodeInspector());
});

gulp.task('start:server:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} --debug-brk ${serverPath}`)
    .on('log', onServerLog);
});

gulp.task('watch', () => {
  plugins.livereload.listen();

  plugins.watch(paths.client.styles, () => { //['inject:scss']
    gulp.src(paths.client.mainStyle)
      .pipe(plugins.plumber())
      .pipe(styles())
      .pipe(gulp.dest('.tmp/app'))
      .pipe(plugins.livereload());
  });

  plugins.watch(paths.client.views)
    .pipe(plugins.plumber())
    .pipe(plugins.livereload());

  plugins.watch(paths.client.scripts) //['inject:js']
    .pipe(plugins.plumber())
    .pipe(transpileClient())
    .pipe(gulp.dest('.tmp'))
    .pipe(plugins.livereload());

  gulp.watch('bower.json', ['wiredep:client']);
});

gulp.task('serve', cb => {
  runSequence(['clean:tmp', 'constant', 'env:all'], ['lint:scripts', 'inject'], ['wiredep:client'], ['transpile:client', 'styles'], ['start:server', 'start:client'],
    'watch',
    cb);
});

gulp.task('serve:dist', cb => {
  runSequence(
    'build',
    'env:all',
    'env:prod', ['start:server:prod', 'start:client'],
    cb);
});

gulp.task('serve:debug', cb => {
  runSequence(['clean:tmp', 'constant'], ['lint:scripts', 'inject'], ['wiredep:client'], ['transpile:client', 'styles'],
    'start:inspector', ['start:server:debug', 'start:client'],
    'watch',
    cb);
});

// inject bower components
gulp.task('wiredep:client', () => {
  return gulp.src(paths.client.mainView)
    .pipe(wiredep({
      exclude: [
                /bootstrap.js/,
                '/json3/',
                '/es5-shim/',
                /font-awesome\.css/,
                /bootstrap\.css/,
                /bootstrap-sass-official/
            ],
      ignorePath: clientPath
    }))
    .pipe(gulp.dest(`${clientPath}/`));
});

/********************
 * Build
 ********************/

//FIXME: looks like font-awesome isn't getting loaded
gulp.task('build', cb => {
  runSequence(
        [
            'clean:dist',
            'clean:tmp'
        ],
    'inject',
    'wiredep:client', [
            'build:images',
            'copy:extras',
            'copy:fonts',
            'copy:assets',
            'copy:server',
            'transpile:server',
            'build:client'
        ],
    cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {
  dot: true
}));

gulp.task('build:client', ['transpile:client', 'styles', 'html', 'constant', 'build:images'], () => {
  var manifest = gulp.src(`${paths.dist}/${clientPath}/assets/rev-manifest.json`);

  var appFilter = plugins.filter('**/app.js', {
    restore: true
  });
  var jsFilter = plugins.filter('**/*.js', {
    restore: true
  });
  var cssFilter = plugins.filter('**/*.css', {
    restore: true
  });
  var htmlBlock = plugins.filter(['**/*.!(html)'], {
    restore: true
  });

  return gulp.src(paths.client.mainView)
    .pipe(plugins.useref())
    .pipe(appFilter)
    .pipe(plugins.addSrc.append('.tmp/templates.js'))
    .pipe(plugins.concat('app/app.js'))
    .pipe(appFilter.restore)
    .pipe(jsFilter)
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(plugins.cleanCss({
      processImportFrom: ['!fonts.googleapis.com']
    }))
    .pipe(cssFilter.restore)
    .pipe(htmlBlock)
    .pipe(plugins.rev())
    .pipe(htmlBlock.restore)
    .pipe(plugins.revReplace({
      manifest
    }))
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('html', function () {
  return gulp.src(`${clientPath}/{app,components}/**/*.html`)
    .pipe(plugins.angularTemplatecache({
      module: 'sebaFreshApp'
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('constant', function () {
  let sharedConfig = require(`./${serverPath}/config/environment/shared`);
  return plugins.ngConstant({
      name: 'sebaFreshApp.constants',
      deps: [],
      wrap: true,
      stream: true,
      constants: {
        appConfig: sharedConfig
      }
    })
    .pipe(plugins.rename({
      basename: 'app.constant'
    }))
    .pipe(gulp.dest(`${clientPath}/app/`))
});

gulp.task('build:images', () => {
  return gulp.src(paths.client.images)
    .pipe(plugins.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(plugins.rev())
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
    .pipe(plugins.rev.manifest(`${paths.dist}/${clientPath}/assets/rev-manifest.json`, {
      base: `${paths.dist}/${clientPath}/assets`,
      merge: true
    }))
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:extras', () => {
  return gulp.src([
        `${clientPath}/favicon.ico`,
        `${clientPath}/robots.txt`,
        `${clientPath}/.htaccess`
    ], {
      dot: true
    })
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('copy:fonts', () => {
  return gulp.src(`${clientPath}/bower_components/{bootstrap,font-awesome}/fonts/**/*`, {
      dot: true
    })
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/bower_components`));
});

gulp.task('copy:assets', () => {
  return gulp.src([paths.client.assets, '!' + paths.client.images])
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:server', () => {
  return gulp.src([
        'package.json',
        'bower.json',
        '.bowerrc',
        'server/bin/**/*',
        'server/i18n/**/*',
        'server/views/**/*'
    ], {
      cwdbase: true
    })
    .pipe(gulp.dest(paths.dist));
});

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
  buildcontrol: {
    options: {
      dir: paths.dist,
      commit: true,
      push: true,
      connectCommits: false,
      message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
    },
    heroku: {
      options: {
        branch: 'master',
        remote: 'https://git.heroku.com/sebafresh.git'
      }
    },
    openshift: {
      options: {
        remote: 'openshift',
        branch: 'master'
      }
    }
  }
});

grunt.loadNpmTasks('grunt-build-control');

gulp.task('buildcontrol:heroku', function (done) {
  grunt.tasks(
        ['buildcontrol:heroku'], //you can add more grunt tasks in this array
    {
      gruntfile: false
    }, //don't look for a Gruntfile - there is none. :-)
    function () {
      done();
    }
  );
});
gulp.task('buildcontrol:openshift', function (done) {
  grunt.tasks(
        ['buildcontrol:openshift'], //you can add more grunt tasks in this array
    {
      gruntfile: false
    }, //don't look for a Gruntfile - there is none. :-)
    function () {
      done();
    }
  );
});
