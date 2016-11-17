Builder Docs Archetype
======================

A [Builder][] archetype for Formidable static React landers.

## Landers

### Integration

1. In the root, you need to create a `./static-routes.js` file that exports an array
of all the routes your heart desires.

```js
module.exports = [
  "/",
  "/about",
  "/pineapples"
];
```

### Lander Release

To release a project _controlled_ by this archetype (e.g., `victory-docs`),
use the following guide:

**IMPORTANT - NPM**: To correctly run `preversion` your first step is to make
sure that you have a very modern `npm` binary:

```sh
$ npm install -g npm
```

Built files in `build/` should **not** be committed during development or PRs.
Instead we _only_ build and commit them for published, tagged releases. So
the basic workflow is:

```sh
# Make sure you have a clean, up-to-date `master`
$ git pull
$ git status # (should be no changes)

# Choose a semantic update for the new version.
# If you're unsure, read about semantic versioning at http://semver.org/
$ npm version major|minor|patch -m "Version %s - INSERT_REASONS"

# Push the `build/` directory, version commits, and tag:
$ git push --follow-tags

# And finally publish to `npm`!
$ npm publish
```

And you've published!

For a reliable systems of releases, the landers should aim for versioning along these lines:

- **Patch**: Typos, missing assets, broken styles, very minor copyedits.
- **Minor**: Add a new blog post, change styles.
- **Major**: Rearchitect how the lander works, remove pages, or something else huge.

For additional information on the underlying NPM technologies and approaches,
please review:

* [`npm version`](https://docs.npmjs.com/cli/version): Runs verification,
  builds `build/` via `scripts` commands.
* [`npm publish`](https://docs.npmjs.com/cli/publish): Uploads to NPM.

## Archetype

This section applies to the archetype itself (`builder-docs-archetype`).

### Builder Dependencies

You can read the [Builder docs][] for the full story. Here is an overview of the
Builder three-way dependency scheme:

* `package.json:dependencies`: Production dependencies for the archetype
  installed in a project.
* `dev/package.json:dependencies`: Development dependencies for the archetype
  installed in a project.
* `package.json:devDependencies`: The development dependencies used _internally_
  for the this archetype during development (self tests, checks, etc.) that
  are **not** part of the overall archetype outside workflow.

### Checks, Tests

Run `npm run builder:check`

### Archetype Release

For tagged official releases _only_ of the archetype, make sure to:

1. Bump `package.json` version
2. Generate a new `ARCHETYPE-dev` `package.json`
3. Add to git, tag, and publish

```sh
$ vim package.json            # Bump version
$ vim CHANGELOG.md            # Add version notes
$ builder-support gen-dev     # Generate `dev/*` files
$ npm run builder:check       # Last check!
$ git add package.json dev
$ git commit -m "Version bump"
$ git tag -a "vNUMBER" -m "vNUMBER - INSERT_REASONS" # Create tag
$ git push --follow-tags
$ npm publish                 # Publish main project
$ cd dev && npm publish       # Publish dev project
```

[Builder]: https://github.com/FormidableLabs/builder
[Builder docs]: http://formidable.com/open-source/builder/
