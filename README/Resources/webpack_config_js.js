const resolve = require('path').resolve; // resolve 함수를 가져옴

module.exports = {

    // context: 절대경로, entry 옵션을 위한 기본 폴더를 지정
    // resolve("js") 는 현재 폴더 경로 + /js/ 를 반환한다. entry 에서 사용하게 될 경로
    context: resolve("js"),

    // entry: 번들을 위한 엔트리 지점을 지정
    entry: "./routes.js",

    // output: 컴파일 옵션을 설정한다. webpack 의 컴파일 방법을 지정
    output: {
        // path: 컴파일 후 사용될 절대경로를 지정
        path: resolve("dist"),
        // filename: 컴파일 후 사용하게 될 파일명. 관례적으로 bundle.js 를 사용. 절대경로 사용하지 말 것!
        filename: "./bundle.js",
        // publicPath: 브라우저가 참조하게 될 주소, CDN 주소도 사용 가능
        publicPath: "/dist/",
    },

    // bundle.js 에서 Source map 을 추가해줌
    // 개발환경에서 사용된다. Production 에서는 사용하지 않음
    devtool: 'source-map',

    // module: 모듈(들)에 대한 옵션을 지정
    module: {
        // loaders: 사용하게 될 로더들을 지정
        loaders: [{
                // test 에서 정규식으로 js파일을 선별한 후 babel-loader 로 트랜스파일링
                // node_modules 폴더는 제외
                // package.json 에 babel-cli 를 설치하면 babel-core 같이 깔림
                test: /\.js$/,
                exclude: '/node_modules/',
                loader: 'babel-loader',

                // babel loader 의 트랜스파일링 설정 값
                query: {
                    presets: ['es2015']
                }
            },
            {
                // css 파일 선별 후, style-loader, css-loader 를 사용
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                // 이미지 파일 확장자들 선별 후, url-loader 를 사용
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader'
            }
        ]
    }

}