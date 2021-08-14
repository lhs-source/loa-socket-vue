const fs = require('fs');
var webpack = require('webpack');
let packageJson = fs.readFileSync('./package.json')
let version = JSON.parse(packageJson).version || 0


module.exports = {
  assetsDir: 'static',
  devServer: {
    proxy: {
      '^/api': {
        // TODO - 환경변수 우선으로, 아래 값은 default 로
        target: process.env.VUE_APP_PROXY_HOST,
        ws: true,
        changeOrigin: true
      },
    },
    disableHostCheck: true,


  },
  css: {
      loaderOptions: {
          sass: {
              prependData: `@import "@/scss/common.scss";`
          }
      }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
          'process.env': {
              PACKAGE_VERSION: '"' + version + '"'
          }
      })
    ]
  },
}