module.exports = {
    css: {
        loaderOptions: {
            sass: {
                //依次导入的公用的scss变量，公用的scss混入，共用的默认样式
                prependData: `
                    @import "./src/assets/css/reset.scss";
                    @import "./src/assets/css/global.scss";
                    @import "@nutui/nutui/dist/styles/index.scss";
                `
            }
        }
    },
    devServer: {
        // development server port 8000
        port: 8000,
        // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
        proxy: {
            '/api': {
                target: 'https://w7demo.test.noteo.cn/app/index.php?i=4&m=tp5_web&c=entry&a=wxapp&do=api&tpp=/',  // target host
                ws: true,  // proxy websockets
                changeOrigin: true,  // needed for virtual hosted sites
                pathRewrite: {
                    '^/api': ''  // rewrite path
                }
            },
        }
    },
    lintOnSave: false
}
