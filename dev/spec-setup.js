/* eslint-disable global-require, no-console */
var rowdy = require("rowdy");
var defaults = require("lodash.defaultsdeep");
var MochaAdapter = rowdy.adapters.mocha;

var SERVER_HOST = "127.0.0.1";
var SERVER_PORT = "3000";

// Base directory for app on server, e.g., /open-source/victory
global.TEST_FUNC_BASE_DIR = process.env.TEST_FUNC_BASE_DIR || "";
// Full app server url, e.g., http://localhost:3000/open-source/victory
global.TEST_FUNC_BASE_URL = process.env.TEST_FUNC_BASE_URL || "http://" + SERVER_HOST + ":" + SERVER_PORT + global.TEST_FUNC_BASE_DIR;

var base = require("rowdy/config");
var config = defaults({
  options: {
    driverLib: "webdriverio"
  },
  settings: {
    local: {
      default: {
        remote: {
          // http://webdriver.io/guide/getstarted/configuration.html#baseUrl
          baseUrl: global.TEST_FUNC_BASE_URL
        }
      }
    }
  }
}, base);
rowdy(config);

var adapter = new MochaAdapter();

var ELEM_WAIT = 200;

adapter.before();
adapter.beforeEach();

beforeEach(function () {
  return adapter.client
    .timeouts("implicit", ELEM_WAIT); // Set timeout for waiting on elements.
});

adapter.afterEach();
adapter.after();

/*
 * Serve src with webpack-dev-server
 */

var serveDev = function (cb) {
  console.log("Starting dev server...");
  var webpack = require("webpack");
  var WebpackDevServer = require("webpack-dev-server");

  var webpackCfg = require("builder-docs-archetype/config/webpack/webpack.config.dev");

  var compiler = webpack(webpackCfg);
  var wdsServer = new WebpackDevServer(compiler, {
    hot: false,
    stats: "errors-only",
    historyApiFallback: true
  });

  wdsServer.listen(SERVER_PORT, SERVER_HOST, cb);
};

/*
 * Serve static ./build dir
 */

var serveStatic = function (cb) {
  console.log("Starting static server...");
  var http = require("http");
  var ecstatic = require("ecstatic");

  http.createServer(
    ecstatic({ root: "./build", baseDir: global.TEST_FUNC_BASE_DIR + "/" })
  ).listen(SERVER_PORT, SERVER_HOST, cb);
};

/*
 * Before tests run, determine URL and server needs
 */

before(function (done) {
  switch (process.env.TEST_FUNC) {
  case "static": return serveStatic(done);
  case "dev": return serveDev(done);
  case "remote":
    if (!process.env.TEST_FUNC_BASE_URL) {
      console.warn("No TEST_FUNC_BASE_URL environment variable set. Defaulting to " +
        global.TEST_FUNC_BASE_URL + "\n");
    }
    return done();
  }
  return done();
});

module.exports = {
  adapter: adapter
};
