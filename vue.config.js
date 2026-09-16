const path = require('path');
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
  // dev 编译链路不再逐模块跑 eslint（冷启动提速明显）；需要检查时用 `npm run lint` 或 IDE 实时 lint
  lintOnSave: false,
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

    // 大小写一致性检查（拦截 import 路径大小写与磁盘不符，防部署 Linux 后 Module not found）
    // 仅在生产构建保留兜底；本地（Windows/macOS 大小写不敏感）跳过校验，减少每个模块的文件系统检查
    if (!isProduction) {
      config.plugins.delete('case-sensitive-paths');
    }

    // vue-cli 源码仅在生产启用 thread-loader（见 @vue/cli-plugin-babel 的 useThreads），
    // dev 下 babel 是单线程转译全部模块；这里补齐为与生产一致的多线程链路：cache → thread → babel
    if (!isProduction) {
      config.module.rule('js')
        .use('thread-loader')
        .loader(require.resolve('thread-loader'))
        .before('babel-loader');
    }

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
        // webpack4 生产默认上限为 maxAsyncRequests:5 / maxInitialRequests:3，适度放宽以容纳分包
        maxAsyncRequests: 10,
        maxInitialRequests: 10,
        cacheGroups: {
          // 首屏依赖的 node_modules（chunks 限 initial，防止仅异步页面使用的库被并入首屏 chunk-vendors）
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          // 被多个异步页面共享的 node_modules 统一提取，避免重复打进各页面 chunk
          asyncVendors: {
            name: 'chunk-async-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -9,
            chunks: 'async',
            minChunks: 2,
            reuseExistingChunk: true
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
          // 提取 src/libs 共享组件（FetchSelect等），仅异步复用时提取，不改变首屏构成
          commonLibs: {
            name: 'chunk-common-libs',
            test: /[\\/]src[\\/]libs[\\/]/,
            minChunks: 2,
            priority: 10,
            chunks: 'async',
            reuseExistingChunk: true
          },
          // 提取 src/common 共享工具和常量，仅异步复用时提取
          commonUtils: {
            name: 'chunk-common-utils',
            test: /[\\/]src[\\/]common[\\/]/,
            minChunks: 2,
            priority: 5,
            chunks: 'async',
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
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
      // dev serve（热更新）不允许 [contenthash]/[chunkhash]，仅生产使用 contenthash 长缓存；
      // 不带版本 query——query 随每次发版变化会全量击穿 contenthash 长缓存
      filename: isProduction
        ? 'static/js/[name].[contenthash].js'
        : 'static/js/[name].[hash].js',
      chunkFilename: isProduction
        ? 'static/js/[name].[contenthash].js'
        : 'static/js/[name].[hash].js'
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
    // dev 源码映射：eval 行级映射，编译开销低且可断点调试；要更快可改 false（完全无映射）
    devtool: isProduction ? false : 'cheap-module-eval-source-map'
  },
  css: {
    // css sourceMap：默认关闭，加快编译（省去 sass/css/postcss 各环节的 map 生成）。
    // 需要在浏览器 devtools 里定位 css 源文件时改为 true
    sourceMap: false
  }
};
