const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// config parts
const Workbox = require('./configs/workbox.js');

const PUBLIC_PATH = 'URL';

module.exports = {
  entry: [
    "./src/js/index.js",
    './src/scss/index.scss'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "js/[name].[hash:5].js",
  },
  optimization: {
    minimizer: [new TerserJSPlugin({})],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        },
        global: {
          name: 'global',
          test: /global/,
          chunks: 'all',
          enforce: true
        },
        pages: {
          name: 'pages',
          test: /pages/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use:  [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          // работаем с @import и url()
          {
            loader: 'css-loader',
            options: {
              modules: 'global'
            }
          },
          // далее, по .css файлу проходиться postcss-loader да бы, проставить все нужные полифиллы и префиксы к свойствам
          'postcss-loader',
          // в начале sass-loader переводить .scss файл в .css
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true // optional
              },
            }
          }
        ]
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // fonts
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          publicPath: 'fonts',
          outputPath: 'fonts',
          name: '[name].[sha1:hash:base64:5].[ext]'
        },
      },
      {
        test: /\.(svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          publicPath: 'dist/icons',
          outputPath: 'icons',
          name: '[name].[sha1:hash:base64:5].[ext]'
        },
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          publicPath: 'dist/imgs',
          outputPath: 'imgs',
          name: '[name].[sha1:hash:base64:5].[ext]'
        },
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.[hash:4].css',
    }),

    new VueLoaderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        }
      }
    }),
    //new BundleAnalyzerPlugin(),
    //Workbox
  ],
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue: 'vue/dist/vue.runtime.min.js',
      'vue-router': 'vue-router/dist/vue-router.min.js',
      'vuex': 'vuex/dist/vuex.min.js',
      'images': path.resolve(__dirname, './src/imgs'),
      'icons': path.resolve(__dirname, './src/icons')
    }
  },
  node: {
    module: 'empty',
    fsevents: 'empty',
    net: 'empty',
    tls: 'empty',
    setImmediate: false,
    process: false
  }
};
