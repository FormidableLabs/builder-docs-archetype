"use strict";

var path = require("path");
var webpack = require("webpack");

var StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

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
    new webpack.DefinePlugin({
      "process.env": {
        // On travis, production will disable warnings for static build
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "staging")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // TODO: add uglify & dedup https://github.com/FormidableLabs/builder-docs-archetype/issues/1
    new StatsWriterPlugin({
      filename: "stats.json"
    }),
    new StaticSiteGeneratorPlugin("main", routes, null, {
      // Shim browser globals.
      navigator: {
        // Needed for: `./~/bowser/src/bowser.js`
        userAgent: ""
      },
      window: {},
      document: {
        // Optional client-side render checks whether document is undefined
        // instead check whether it's being shimmed
        shim: true,
        // Needed for: `./~/formidable-landers/~/radium/lib/keyframes.js`
        createElement: function () {
          // Needs to return something for code like: `"draggable" in document.createElement("div")`
          return {
            setAttribute: function () {}
          };
        },
        head: {
          appendChild: function () {}
        }
      }
    })
  ]
};
