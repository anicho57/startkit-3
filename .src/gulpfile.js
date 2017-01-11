var path = {
    module: 'z://WEB/lib/node_modules/',
    src : "", // Gulpに関わるもろもろ
    dist : "../", // 公開ファイル置き場
    copy : ".copy/", // サイトデータまるまる複製
    update : "diff/" // 変更差分ファイル置き場
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
        proxy: "127.0.0.1/"
  });
});
// bs reload target
// cssはsass taskで
var html_src = [
    path.dist + "**/*.html",
    path.dist + "**/*.php",
    path.dist + "**/*.js",
    path.dist + "**/*.{png,jpg,gif,svg}",
    '!'+path.dist+'.src/**/*.*'
];

// date format
require(path.module + 'date-utils');

// 変更ファイルのみ抽出
var changed = require(path.module + 'gulp-changed');
// リネーム
var rename = require(path.module + 'gulp-rename');
// 通知
var notify = require(path.module + 'gulp-notify');
var plumber = require(path.module + 'gulp-plumber');

// sassコンパイル
var sass_src = path.src + "sass/**/*.scss";
var sass_dist = path.dist + "css/";
var sass = require(path.module + 'gulp-sass');
var sourcemaps = require(path.module + 'gulp-sourcemaps');
var postcss = require(path.module + 'gulp-postcss');
var cssnext = require(path.module + 'postcss-cssnext');
// var csscomb = require(path.module + 'gulp-csscomb');

gulp.task("sass", function(){
    var processors = [
      cssnext({
          browsers: ['last 3 versions', 'ie 10', 'ios 6', 'android 4'],
      })
    ];
    gulp.src(sass_src)
        .pipe(plumber({ // エラー時にgulpが止まらない。
            errorHandler: notify.onError('Error: <%= error.message %>') // gulp-notifyでエラー通知を表示
        }))
        .pipe(sourcemaps.init()) // ソースマップ吐き出す設定
        // :expanded        {} で改行する形。よくみる CSS の記述形式はこれです。可読性たかし。
        // :nested      Sass ファイルのネストがそのまま引き継がれる形。
        // :compact     セレクタと属性を 1 行にまとめて出力。可読性低め。
        // :compressed  圧縮して出力（全ての改行・コメントをトルツメ）。可読性は投げ捨て。
        .pipe(sass({outputStyle: 'compact'}))
        .pipe(postcss(processors))
        // .pipe(csscomb())
        .pipe(gulp.dest( sass_dist ))
        .pipe(browserSync.stream())
        .pipe(notify({
            title: '<%= file.relative %>をコンパイルしました。',
            message: '<%= options.date.toFormat("YYYY年MM月DD日 HH24時MI分SS秒") %>',
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(sourcemaps.write(sass_dist));
});

// css軽量化
var cssmin_src = sass_dist + '*.css';
var cssmin_dist = sass_dist + 'min/';
var cssmin = require(path.module + 'gulp-cssmin');
gulp.task("cssmin", function(){
    gulp.src(cssmin_src)
        .pipe(cssmin())
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest( cssmin_dist ));
});

// js文法チェック
var js_src = path.dist + "js/*.js";
var jshint = require(path.module + 'gulp-jshint');
gulp.task("jshint", function(){
    gulp.src(js_src)
        .pipe(changed( js_src ))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// 画像減色と軽量化
var image_src = path.src + 'img/**/*.{png,jpg,gif,svg}';
var image_dist = path.dist + 'img/';
var imagemin = require(path.module + 'gulp-imagemin');
gulp.task("image", function(){
    gulp.src( image_src )
    .pipe(changed( image_dist ))
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest( image_dist ));
});

// 変更のあったファイルを更新用フォルダにコピー
var update_src = [path.dist + "**/*.*", '!'+path.dist+'.src/**/*.*' ];
gulp.task("update", function(){
    gulp.src( update_src )
        .pipe(changed( path.copy ))
        .pipe(gulp.dest( path.copy ))
        .pipe(gulp.dest( path.update ));
});

// 更新監視
var watch = require(path.module + 'gulp-watch');
gulp.task("default", function(){
    gulp.start("serve");
    watch( html_src ).on('change', browserSync.reload);
    watch( sass_src, function(e){ gulp.start("sass"); } );
    // watch( cssmin_src, function(e){ gulp.start("cssmin"); } );
    // watch( js_src, function(e){ gulp.start("jshint"); } );
    watch( image_src, function(e){ gulp.start("image"); } );
    watch( update_src, function(e){ gulp.start("update"); } );
});

