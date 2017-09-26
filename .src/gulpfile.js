var path = {
    // module: '/home/mosk/lib/node/node_modules/',
    module: 'c://lib/node/node_modules/',
    // module: 'z://WEB/lib/node_modules/',
    src : '', // Gulpに関わるもろもろ
    dist : '../', // 公開ファイル置き場
    copy : '.copy/', // サイトデータまるまる複製
    update : 'diff/' // 変更差分ファイル置き場
};

// gulp本体
var gulp = require('gulp');
// Browser Sync
var browserSync = require(path.module + 'browser-sync').create();
gulp.task('serve', function(){
  // プロキシを使用
  browserSync.init({
        open: false,
        reloadDelay: 0,
        proxy: '127.0.0.1'
  });
});
gulp.task('src-reload', function(){
    browserSync.reload();
});
// bs reload target
// cssはsass taskで
var html_src = [
    path.dist + '**/*.html',
    path.dist + '**/*.php',
    path.dist + '**/*.js',
    path.dist + '**/*.{png,jpg,gif,svg}',
    '!'+path.dist+'.src/**/*.*'
];

// date format
require(path.module + 'date-utils');

// 変更ファイルのみ抽出
var changed = require(path.module + 'gulp-changed');
//　更新があったファイルのコンパイル・・NWDだと遅い・・・
var cache = require(path.module + 'gulp-cached');
var sassPartialsImported = require(path.module + 'gulp-sass-partials-imported');
// sassで*読み込みできるはず・・・
var globSass = require(path.module + 'gulp-sass-glob-import');

var gulpif = require(path.module + 'gulp-if');

// リネーム
var rename = require(path.module + 'gulp-rename');
// 通知
var notify = require(path.module + 'gulp-notify');
var plumber = require(path.module + 'gulp-plumber');

// sassコンパイル
var sass_src = path.src + 'sass/**/*.scss';
var sass_dist = path.dist + 'css/';
var sass = require(path.module + 'gulp-sass');
var sassInheritance = require(path.module + 'gulp-sass-multi-inheritance');
var sourcemaps = require(path.module + 'gulp-sourcemaps');
var postcss = require(path.module + 'gulp-postcss');
var cssnext = require(path.module + 'postcss-cssnext');
// var csscomb = require(path.module + 'gulp-csscomb');

gulp.task('sass', function(){
    var processors = [
      cssnext({
          browsers: ['last 3 versions', 'ie 10', 'ios 6', 'android 4'],
      })
    ];
    return gulp.src(sass_src)
        // キャッシュその１
        // .pipe(gulpif(global.isWatching, cache('sass')))
        // .pipe(sassInheritance({dir: path.src + 'sass/'}))

        // キャッシュその２
        .pipe(cache('sass'))
        .pipe(sassPartialsImported(path.src + 'sass/'))

        // .pipe(globSass())
        .pipe(sourcemaps.init()) // ソースマップ吐き出す設定
        // .pipe(plumber({ // エラー時にgulpが止まらない。
        //     errorHandler: notify.onError('Error: <%= error.message %>') // gulp-notifyでエラー通知を表示
        // }))
        // :expanded        {} で改行する形。よくみる CSS の記述形式はこれです。可読性たかし。
        // :nested      Sass ファイルのネストがそのまま引き継がれる形。
        // :compact     セレクタと属性を 1 行にまとめて出力。可読性低め。
        // :compressed  圧縮して出力（全ての改行・コメントをトルツメ）。可読性は投げ捨て。
        // .pipe(sass({outputStyle: 'compact'}))
        .pipe(sass({outputStyle: 'compact'}).on('error', function(err) {
            console.error(err.message);
            browserSync.notify(err.message.replace(/\r\n/g, "<br>").replace(/(\n|\r)/g, "<br>"), 6000); // Display error in the browser
            this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
        }))
        .pipe(postcss(processors))
        // .pipe(csscomb())
        // .pipe(notify({
        //     title: '<%= file.relative %>をコンパイルしました。',
        //     message: '<%= options.date.toFormat("YYYY年MM月DD日 HH24時MI分SS秒") %>',
        //     templateOptions: {
        //         date: new Date()
        //     }
        // }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( sass_dist ))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

// css軽量化
var cssmin_src = sass_dist + '*.css';
var cssmin_dist = sass_dist + 'min/';
var cssmin = require(path.module + 'gulp-cssmin');
gulp.task('cssmin', function(){
    return gulp.src(cssmin_src)
        .pipe(cssmin())
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest( cssmin_dist ));
});

// js文法チェック
var js_src = path.dist + 'js/*.js';
var jshint = require(path.module + 'gulp-jshint');
gulp.task('jshint', function(){
    return gulp.src(js_src)
        .pipe(changed( js_src ))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// 画像減色と軽量化
var image_src = path.src + 'img/**/*.{png,jpg,gif,svg}';
var image_dist = path.dist + 'img/';
var imagemin = require(path.module + 'gulp-imagemin');
gulp.task('image', function(){
    return gulp.src( image_src )
    .pipe(changed( image_dist ))
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest( image_dist ));
});

// 変更のあったファイルを更新用フォルダにコピー
var update_src = [path.dist + '**/*.*', '!'+path.dist+'.src/**/*.*' ];
gulp.task('update', function(){
    return gulp.src( update_src )
        .pipe(changed( path.copy ))
        .pipe(gulp.dest( path.copy ))
        .pipe(gulp.dest( path.update ));
});

gulp.task('setWatch', function() {
    global.isWatching = true;
});
// 更新監視
var watch = require(path.module + 'gulp-watch');
gulp.task('default', function(){
    gulp.start('serve');

    // gulp.watch( html_src ).on('change', browserSync.reload);
    // gulp.watch( sass_src, [ 'sass'] );
    // gulp.watch( cssmin_src, ['cssmin'] );
    // gulp.watch( image_src, ['image'] );
    // gulp.watch( update_src, ['update'] );
    // gulp.watch( js_src, ['jshint'] );

    watch( html_src, function(e){ gulp.start("src-reload"); } );
    watch( sass_src, function(e){ gulp.start("sass"); } );
    // watch( cssmin_src, function(e){ gulp.start('cssmin'); } );
    // watch( image_src, function(e){ gulp.start("image"); } );
    // watch( update_src, function(e){ gulp.start('update'); } );
    // watch( js_src, function(e){ gulp.start('jshint'); } );

});

