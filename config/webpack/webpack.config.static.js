"use strict";

var path = require("path");
var webpack = require("webpack");
var postcssImport = require("postcss-import");
var postcssnext = require("postcss-cssnext");

var StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var base = require("./webpack.config.base.js");

var OUTPUT_DIR = "build";

// Replace with `__dirname` if using in project root.
var ROOT = process.cwd();
var SRC = path.join(ROOT, "src");

// All routes we want to static-render:
var routes = require(path.join(ROOT, "static-routes"));

module.exports = {
  entry: {
    main: [path.join(SRC, "components", "entry.js")]
  },
  output: {
    path: path.join(ROOT, OUTPUT_DIR),
    filename: "main.[hash].js",
    libraryTarget: "umd" // Needs to be universal for `static-site-generator-webpack-plugin` to work
  },
  resolve: base.resolve,
  module: {
    loaders: base.module.loaders.concat([
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          require.resolve("style-loader"),
          // yep. these 2 loaders need to resolve together first
          [ require.resolve("css-loader"), require.resolve("postcss-loader") ]
        )
      }
    ])
  },
  postcss: function (webpack) { //eslint-disable-line no-shadow
    return [
      postcssImport({ addDependencyTo: webpack }),
      postcssnext
    ];
  },
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
    new StatsWriterPlugin({
      filename: "stats.json"
    }),
    new ExtractTextPlugin("styles.[hash].css"),
    new StaticSiteGeneratorPlugin("main", routes, null, {
      // Shim browser globals.
      navigator: {
        // Needed for: `./~/bowser/src/bowser.js`
        // Work around https://github.com/FormidableLabs/radium/issues/822
        // Explanation: When `userAgent` is empty, radium will generate
        // something like `display: flex,-webkit-flex,…`, which is invalid on
        // ALL browsers. Forcing it to use a specific userAgent makes it appear
        // right in evergreen browsers. For other browsers, Radium will fix the
        // prefixing upon loading in the browser.
        userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36"
      },
      window: {
        // Optional client-side render checks whether document is undefined
        // instead check whether it's being shimmed
        __STATIC_GENERATOR: true,
        // Needed for: `./~/babel-standalone/babel.js`
        addEventListener: function () {},
        // Needed for style-loader (????)
        navigator: {
          // Work around https://github.com/FormidableLabs/radium/issues/822
          // Explanation: When `userAgent` is empty, radium will generate
          // something like `display: flex,-webkit-flex,…`, which is invalid on
          // ALL browsers. Forcing it to use a specific userAgent makes it appear
          // right in evergreen browsers. For other browsers, Radium will fix the
          // prefixing upon loading in the browser.
          userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36"
        }
      },
      document: {
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
      },
      // Needed for ecology's clipboard.js dependency
      Element: function () {}
    }),
    // Webpack's `--bail` option seems to **still** not be terminating the build
    // with a non-zero exit code. This is the suggested interim hack.
    //
    // BUG: https://github.com/webpack/webpack/issues/708
    /* eslint-disable no-console, no-invalid-this, no-magic-numbers, no-process-exit */
    function () {
      this.plugin("done", function (stats) {
        var errs = stats.compilation.errors || [];

        // Manually bail out if have errors and **not** in watch mode.
        if (errs.length && process.argv.indexOf("--watch") === -1) {
          // Need to manually log out errors.
          errs.forEach(function (err) {
            console.error("\n\n" + (err.stack || err));
          });
          process.exit(1);
        }
      });
    }
    /* eslint-enable no-console, no-invalid-this, no-magic-numbers, no-process-exit */
  ]
};
