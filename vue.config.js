const zlib = require("zlib");
module.exports = {

  productionSourceMap: false,
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true
    }
  },
  configureWebpack: {
    output: { filename: '[name].[hash].bundle.js' },
      optimization: {
        splitChunks: {
          minSize: 10000,
          maxSize: 250000,
        }
      }
  },
  pluginOptions: {
    compression:{
      brotli: {
        filename: '[file].br[query]',
        algorithm: 'brotliCompress',
        include: /\.(js|css|html|svg|json|vue)(\?.*)?$/i,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        minRatio: 0.8,
      },
      gzip: {
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        include: /\.(js|css|html|svg|json|vue)(\?.*)?$/i,
        minRatio: 0.8,
      }
    }
  }
};