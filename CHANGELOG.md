# Docs Archetype

# 4.2.1 (2016 Oct 31)
* Don’t transpile victory dependencies in webpack.

# 4.2.0 (2016 Oct 31)
* Add `npm version` workflow support + docs.

# 4.1.2 (2016 Sept 16)
* Add victory-docs to babel parsing
* Add history api fallback flag to dev task

# 4.1.1 (2016 Sept 16)
* Fix loader for JPG files (use file-loader)

# 4.1.0 (2016 Sept 16)
* Add support for CSS files; extract into `styles.[hash].css` file for the static build
* Add raw-loader for JPG files

# 4.0.0 (2016 Sept 9)
* Upgrade Webpack to 1.13.2 (potentially a breaking change)

# 3.0.2 (2016 Jul 26)
  * Add baseUrl to webdriverio config

# 3.0.1 (2016 Jul 26)
  * Fix webpack config require

# 3.0.0 (2016 Jul 26)
  * Use ecstatic instead of http-server for static serving

# 2.1.1 (2016 Jul 26)
  * Fix npm install-selenium script

# 2.1.0 (2016 Jul 26)
  * Add scripts and dependencies needed for functional tests
  * Add spec-setup to bootstrap rowdy/selenium/servers

# 2.0.1 (2016 Jul 21)
  * Add json-loader to webpack

# 2.0.0 (2016 Jul 20)
  * Collapse static-entry.jsx and entry.jsx to just entry.js

# 1.0.6 (2016 Jul 20)
  * Add missing global variable to fix static builds for projects that depend on ecology

# 1.0.5 (2016 Jun 21)
  * Add plugin to force build failure when running `webpack-static`
  * Add missing global variable to fix static build for `victory-docs`

# 1.0.4 (2016 Jun 20)
  * Upgrade `babel-eslint` so it depends on babel@6

# 1.0.3 (2016 Jun 17)
  * Add `victory-examples` to webpack so that `victory-docs` can import components directly

# 1.0.2 (2016 Jun 7)
  * Add global variables for static-site-generator-webpack-plugin to fix static build on Travis

# 1.0.0 (2016 Apr 14)
  * Do not apply `npm update` globally; instead, use the local task `update-project` that should be redefined in the project to update specific modules

# 0.0.5 (2016 Mar 31)
  * Add missing dependencies for Victory

# 0.0.4 (2016 Mar 25)
  * Add support for SVGs
