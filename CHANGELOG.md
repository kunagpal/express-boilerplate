# Express Boilerplate Changelog

## v0.3.2 (30 July 2017)

* Deduplicated REST API and incoming data sanitisation code #450
* Added support for content-type negotiation for API error respnses #449

## v0.3.1 (30 July 2017)

* Added sanity tests for static asset serving. #445
* Renamed `prestart` script to `pack`.
* Ensured that test app loads also pack static assets.
* Updated dependencies.
* Ensured that the code coverage manifest directory is cleared before code coverage generation. #448

## v0.3.0 (29 July 2017)

* Ignored the test suite for CodeClimate duplication checks #441
* Cleaned up and compacted structure tests #441
* Added support for `X-Api-Sort`, `X-Api-Skip`, and `X-Api-Limit` headers to the REST API #440
* Removed redundant database purge script.
* Updated dependencies, removed bower from the project.

## v0.2.2 (05 July 2017)

* :white_check_mark: Improved GET API tests #406
* :tada: Swapped out Istanbul with NYC for code coverage #404
* :lock: Updated model globals to be immutble #397

## v0.2.1 (28 June 2017)

* Updated model instantiation mechanisms to not rely on a global `db` #394

## v0.2.0 (26 June 2017)

* Updated dependencies #375-#389
* Removed NSP checks from the test suite #391
* Added REST router for database models #390

## v0.1.5 (01 June 2017)

* Node v8 support. #373
* NODE_ENV is explicitly set to test in unit tests. #363
* Compacted project structural tests,updated test lint rules. #363

## v0.1.4 (21 May 2017)

* Added generic SIGINT cum error event handler to utils #362
* Enabled start options in pm2 script #361
* Explicitly set process.env.NODE_ENV to `test` in test bootstrapper #360
* Temporarily disabled Linux builds on Travis #352
* Updated dependencies

## v0.1.3 (1 May 2017)

* :memo: Added missing JSDoc comments #340
* :gear: Inch CI config #339
* :bug: Fixed a bug where failed unit tests would not fail the overall build #338
* :shirt: Lint improvements #337

## v0.1.2 (1 May 2017)

* Cleaned up project scripts #336
* Updated dependencies

## v0.1.1 (24 April 2017)

* Offloaded CSSLint checks from a package.json command to a reusable script #329

## v0.1.0 (23 April 2017)

* Fixed a bug that caused the test suite to be run twice #326

## v0.0.12 (22 April 2017)

* Project documentation can now be generated via a programmatic script #324

## v0.0.11 (20 April 2017)

* Fixed bug that caused code coverage thresholds to not be enforced #314
* Improved purge script to handle existing `global.db` instance as well #315
* Miscellaneous code and markdown quality improvements
* Cleaned application bootstrap handlers
* Updated dependencies

## v0.0.10 (9 April 2017)

* All scripts now use hashbangs
* CI builds now run on Node versions v4 and 6 only.
* Trimmed down User model code: #304
* Markdown file cleanups
* Global scope changes: #305

## v0.0.9 (6 April 2017)

* Added archive generation script.

## v0.0.8 (5 April 2017)

* Added script to generate wiki.
* Added and used error utilities.

## v0.0.7 (2 April 2017)

* :clock1: Added `updatedAt` timestamps for User.update* actions
* Enabled slicing on User.find* actions
* Enforced unit test code coverage thresolds #286

## v0.0.6 (1 April 2017)

* :apple: Enabled OSX builds on Travis

## v0.0.5 (1 April 2017)

* :arrow_up: Bumped MongoDB version to v3.4.0 for Travis builds
* :green_heart: Fixed sporadic test failures related to database resets
* :shirt: Updated ESLint rules for v3.19.0
* :white_check_mark: User.find*, User.update*, and User.delete* unit tests and improvements

## v0.0.4 (22 March 2017)

* Restored unit test coverage publishing

## v0.0.3 (22 March 2017)

* `User.insert` handles bulk and singular record creation.

## v0.0.2 (13 March 2017)

* Better `SIGINT` handling.
* Cleaned up package scripts.
* Cleaner route instantiation.

## v0.0.1 (12 March 2017)

* App startup improvements.
* Test setup simplification.

## v0.0.0 (3 January 2017)

* CORS configuration
* CI Build configuration
* App control, test, utility scripts
* Code coverage, other miscellaneous badges
* System tests
* DB purge script
* Database model code
* Social authentication code
* Static asset minification script
* Postinstall script for Windows scripts
* ESLint plugins, middleware, NSP, middleware and structural test
* CSSLint
* EditorConfig
* CodeClimate config
* Test configuration
* Added setup instructions
* Added Procfile for deployments
* Added express project skeleton
