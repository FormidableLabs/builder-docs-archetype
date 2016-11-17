"use strict";

var path = require("path");
var postcssImport = require("postcss-import");
var postcssUrl = require("postcss-url");
var postcssNext = require("postcss-cssnext");
var postcssInlineSvg = require("postcss-inline-svg");

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
          path.resolve(ROOT, "node_modules", "victory-docs")
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
        test: /\.(png|jpg|gif)$/,
        loaders: [
          require.resolve("file-loader"),
          require.resolve("image-webpack-loader")
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
  },
  postcss: function (webpack) { // eslint-disable-line no-shadow
    return [
      postcssImport({ addDependencyTo: webpack }),
      postcssUrl,
      postcssNext,
      postcssInlineSvg
    ];
  }
};
