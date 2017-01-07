//require our dependencies
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,
  entry: './assets/js/index',

  devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : null,

  output: {
    path: path.resolve('./assets/bundles/'),
    filename: '[name].js',
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react'],
        },
      },
      {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png",
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]',
      },
    ],
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx'],
  }
}
