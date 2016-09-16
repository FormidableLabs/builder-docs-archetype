"use strict";

var path = require("path");

// Replace with `__dirname` if using in project root.
var ROOT = process.cwd();
var SRC = path.join(ROOT, "src");

module.exports = {
  resolve: {
    extensions: ["", ".js", ".jsx", ".json"]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        // Make sure to formidable-landers is excluded for `npm link` purposes
        include: [
          path.resolve(SRC),
          path.resolve(ROOT, "node_modules", "victory-chart"),
          path.resolve(ROOT, "node_modules", "victory-core"),
          path.resolve(ROOT, "node_modules", "victory-examples"),
          path.resolve(ROOT, "node_modules", "victory-pie")
        ],
        loader: require.resolve("babel-loader"),
        query: {
          presets: ["es2015", "stage-1", "react"]
        }
      }, {
        test: /\.svg$/,
        loaders: [
          require.resolve("raw-loader"),
          require.resolve("image-webpack-loader")
        ]
      }, {
        test: /.(png|jpg|gif)$/,
        loaders: [
          require.resolve("file-loader")
        ]
      }, {
        test: /\.hbs$/,
        loader: require.resolve("handlebars-loader")
      }, {
        test: /\.md$/,
        loader: require.resolve("raw-loader")
      }, {
        test: /\.json$/,
        loader: require.resolve("json-loader")
      }
    ]
  }
};
