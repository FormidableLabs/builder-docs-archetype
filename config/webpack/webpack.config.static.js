"use strict";

var CleanPlugin = require("clean-webpack-plugin");
var path = require("path");
var StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var DefinePlugin = require("webpack").DefinePlugin;

var base = require("./webpack.config.dev.js");

var OUTPUT_DIR = "build";

// Replace with `__dirname` if using in project root.
var ROOT = process.cwd();
var SRC = path.join(ROOT, "src");

// All routes we want to static-render:
var routes = require(path.join(ROOT, "static-routes"));

module.exports = {
  entry: {
    main: [path.join(SRC, "components", "static-entry.jsx")]
  },
  output: {
    path: path.join(ROOT, OUTPUT_DIR),
    filename: "main.[hash].js",
    libraryTarget: "umd" // Needs to be universal for `static-site-generator-webpack-plugin` to work
  },
  resolve: base.resolve,
  module: base.module,
  plugins: [
    new CleanPlugin([ path.join(ROOT, OUTPUT_DIR) ]),
    new DefinePlugin({
      "process.env": {
        // Disable warnings for static build
        NODE_ENV: JSON.stringify("production")
      }
    }),
    // TODO: add uglify & dedup
    new StatsWriterPlugin({
      filename: "stats.json"
    }),
    new StaticSiteGeneratorPlugin("main", routes)
  ]
};
