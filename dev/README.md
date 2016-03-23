Builder Docs Archetype
======================

A [Builder][] archetype for Formidable static React landers.

## Builder Dependencies

You can read the [Builder docs][] for the full story. Here is an overview of the
Builder three-way dependency scheme:

* `package.json:dependencies`: Production dependencies for the archetype
  installed in a project.
* `dev/package.json:dependencies`: Development dependencies for the archetype
  installed in a project.
* `package.json:devDependencies`: The development dependencies used _internally_
  for the this archetype during development (self tests, checks, etc.) that
  are **not** part of the overall archetype outside workflow.

## Checks, Tests

Run `npm run builder:check`

## Release

For tagged official releases _only_, make sure to:

1. Bump `package.json` version
2. Generate a new `ARCHETYPE-dev` `package.json`
3. Add to git, tag, and publish

```sh
$ vim package.json            # Bump version
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
