'use strict';

// node_module 폴더에서 사용할 모듈들을 로드
const gulp = require('gulp');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');
const htmlbuild = require('gulp-htmlbuild');
const sourcemap = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();


// clean 모듈: dist 폴더의 css, js 폴더와 index.html 을 지운다.
gulp.task('clean', function () {
    return gulp.src(['./dist/css', './dist/js', './dist/index.html'], {
            read: false
        })
        .pipe(clean());
});

// concat 모듈: src/js 내의 모든 하위 폴더에서 모든 .js 파일을 찾은 뒤, build.js 라는 하나의 자바스크립트 파일로 만든 후,
// dist/js 폴더에 build.js를 베포한다.
gulp.task('concat', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('build.js'))
        .pipe(gulp.dest('./dist/js/'));
});


// sass 모듈: src/sass 내의 모든 하위 폴더에서 모든 .sass 파일을 찾은 뒤, sourcemap 모듈을 사용해서 매핑하고, 매핑 중
// 오류가 발생하면 sass.logError 가 실행된다. 그리고, dist/css 폴더에 베포한다.
// browsersync 모듈에서 지원하는 .stream() 은 browserSync.reload 와 같은 기능을 하며, 파일의 변화를 감지한다.
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sourcemap.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemap.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});


// browserSync 모듈: dist 폴더를 기준으로 라이브 페이지를 제공한다.
// gulp.watch 를 통해
    // sass 폴더를 관찰하며, 변화가 감지되면 sass task 를 실행한다.
    // .html 파일 변화를 관찰하며, htmlbuild task 를 실행한다.
    // .js 파일 변화를 관찰하며, concat task 를 실행한다.
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './dist/'
        },
    });
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/*.html', ['htmlbuild']).on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', ['concat']).on('change', browserSync.reload);
});


// htmlbuild 모듈
    // src 의 index.html 파일을 대상으로 빌드를 하며, block.write 메소드를 통해 원하는 장소에 베포한다.
    // 자세한 내용은 https://www.npmjs.com/package/gulp-htmlbuild
gulp.task('htmlbuild', function () {
    gulp.src(['./src/index.html'])
        .pipe(htmlbuild({
            js: htmlbuild.preprocess.js(function (block) {
                let path = `./js/build.js`;
                block.write(path);
                block.end();
            })
        }))
        .pipe(gulp.dest('./dist/'));
});


// gulp 의 기본 명령어다. 콘솔에 'gulp' 라고 실행하면 아래의 default 가 실행된다.
gulp.task('default', function (callback) {

    // runSequence 를 통해, task 의 실행 순서를 지정한다.
    // clean 이 가장 먼저 실행되며, htmlbuild, concat, 그리고 sass task 는 그 다음에 동시에 실행된다.
    runSequence('clean', ['htmlbuild', 'concat', 'sass'], callback);

});

// gulp server 로 실행할 수 있으며, 변화를 감지하는 상태가 켜진 라이브 서버를 구동할 때 사용할 수 있다.
gulp.task('server', function(callback){
    
    runSequence('clean', ['htmlbuild', 'concat', 'sass'], 'browserSync', callback);

})