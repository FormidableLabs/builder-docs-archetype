/* eslint-disable global-require, no-console */
var fetch = require("node-fetch");
var rowdy = require("rowdy");
var defaults = require("lodash.defaultsdeep");

var BASE_URL = process.env.npm_package_config_test_func_base_url;
var BASE_DIR = process.env.npm_package_config_test_func_base_dir;
var SERVER_HOST = process.env.npm_package_config_test_func_server_host;
var SERVER_PORT = process.env.npm_package_config_test_func_server_port;
var DEV_SERVER_TIMEOUT = process.env.npm_package_config_test_func_dev_server_timeout;
var MODE = process.env.npm_package_config_test_func_mode;
var ELEM_WAIT = 200;

/*
 * Setup Rowdy/Webdriverio
 */

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
          baseUrl: BASE_URL + BASE_DIR
        }
      }
    }
  }
}, base);
rowdy(config);

/*
 * Setup Mocha adapter
 */

var MochaAdapter = rowdy.adapters.mocha;
var adapter = new MochaAdapter();
adapter.before();
adapter.beforeEach();
beforeEach(function () {
  // Set default timeout for waiting on elements.
  return adapter.client.timeoutsImplicitWait(ELEM_WAIT);
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

  // How long the test should wait before giving up
  this.timeout(DEV_SERVER_TIMEOUT);
  wdsServer.listen(SERVER_PORT, SERVER_HOST, function () {
    fetch("http://" + SERVER_HOST + ":" + SERVER_PORT + BASE_DIR + "/")
      .then(function () { cb(); })
      .catch(cb);
  });
};

/*
 * Serve static ./build dir
 */

var serveStatic = function (cb) {
  console.log("Starting static server...");
  var http = require("http");
  var ecstatic = require("ecstatic");

  http.createServer(
    ecstatic({ root: "./build", baseDir: BASE_DIR + "/" })
  ).listen(SERVER_PORT, SERVER_HOST, cb);
};

/*
 * Before tests run, start a server if necessary
 */

before(function (done) {
  switch (MODE) {
    case "static": return serveStatic.call(this, done);
    case "dev":    return serveDev.call(this, done);
  }
  console.log("Expecting remote server at " + BASE_URL + BASE_DIR);
  return done();
});

module.exports = {
  adapter: adapter,
  baseDir: BASE_DIR,
  baseUrl: BASE_URL
};
