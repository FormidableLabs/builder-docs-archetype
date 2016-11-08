"use strict";

var path = require("path");
var webpack = require("webpack");

// Replace with `__dirname` if using in project root.
var ROOT = process.cwd();
var SRC = path.join(ROOT, "src");

var base = require("./webpack.config.base.js");

module.exports = {
  devServer: {
    contentBase: ROOT,
    noInfo: false
  },
  output: {
    path: ROOT,
    filename: "main.js"
  },
  cache: true,
  context: SRC,
  devtool: "source-map",
  entry: {
    app: [path.join(SRC, "components", "entry.js")]
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: base.resolve,
  module: {
    loaders: base.module.loaders.concat([
      {
        test: /\.css$/,
        loaders: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          require.resolve("postcss-loader")
        ]
      }
    ])
  },
  postcss: base.postcss,
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
