const path = require('path');
const { version } = require('./package');
const { name } = require('./package');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, dir);
}

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';

// 本地环境是否需要使用cdn
const devNeedCdn = false;

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    // 'element-ui': 'ELEMENT',
    axios: 'axios',
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    AMap: 'AMap'
  },
  // cdn的js链接
  js: [
    // '/js/vue.min.js',
    // '/js/vuex.min.js',
    // '/js/vue-router.min.js',
    // '/js/index.js',
    // '/js/axios.min.js'
  ]
};

const port = 7779; // dev port

module.exports = {
  lintOnSave: true,
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  productionSourceMap: false,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/gaode': {
        target: 'https://tsapi.amap.com/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/gaode': ''
        }
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  chainWebpack: config => {
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');

    // 字体文件内联为 base64，解决 qiankun 子应用字体路径问题
    config.module.rule('fonts')
      .use('url-loader')
      .tap(options => ({
        ...options,
        limit: 1024 * 1024
      }));

    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn;
      return args;
    });
    if (isProduction) { // 必须是生产环境，否则会报错，因为以下插件不支持ES6语法
      config.optimization.minimizer('terser').tap(options => {
        options[0].terserOptions.compress.drop_console = true;
        return options;
      });
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        'element-ui': '@leapmotor/element-ui'
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'all'
          },
          // 提取 ali-oss 到独立 chunk，避免在每个页面重复打包
          alioss: {
            name: 'chunk-alioss',
            test: /[\\/]node_modules[\\/]ali-oss[\\/]/,
            priority: 20,
            chunks: 'all'
          },
          // 提取 vxe-table 和 vxe-pc-ui 到独立 chunk
          vxe: {
            name: 'chunk-vxe',
            test: /[\\/]node_modules[\\/](vxe-table|vxe-pc-ui)[\\/]/,
            priority: 20,
            chunks: 'all'
          },
          // 提取 src/libs 共享组件（FetchSelect等）
          commonLibs: {
            name: 'chunk-common-libs',
            test: /[\\/]src[\\/]libs[\\/]/,
            minChunks: 2,
            priority: 10,
            chunks: 'all',
            reuseExistingChunk: true
          },
          // 提取 src/common 共享工具和常量
          commonUtils: {
            name: 'chunk-common-utils',
            test: /[\\/]src[\\/]common[\\/]/,
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    // module: {
    //   rules: [
    //     {
    //       test: /\.scss$/,
    //       use: [
    //         'sass-loader',
    //         {
    //           loader: 'style-resources-loader',
    //           options: {
    //             patterns: [
    //               path.resolve(__dirname, 'src/common/css/base.scss')
    //             ]
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
      filename: `static/js/[name].[hash].js?appVersion=${version}`,
      chunkFilename: `static/js/[name].[hash].js?appVersion=${version}`
    },
    plugins: [
      new MomentLocalesPlugin({
        localesToKeep: ['zh-cn']
      })
    ],
    // 不用cdn，防止微前端应用之间相互污染
    // externals: isProduction || devNeedCdn ? cdn.externals : {
    //   AMap: 'AMap'
    // },
    devtool: isProduction ? false : 'source-map'
  },
  css: {
    // 查看CSS属于哪个css文件
    sourceMap: true
  }
};
