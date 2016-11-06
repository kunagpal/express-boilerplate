# Contributing to express-boilerplate
This document merely outlines guidelines and best practices, not hard rules. Even improvements to [these documents](https://github.com/kunagpal/express-boilerplate/blob/master/.github)
are appreciated. Contributions in all shapes and sizes are welcome, provided they add meaning to the project. These may come in the form of new features (:tada:),
bug fixes (preferably with corresponding unit / e2e tests), or improvements / optimizations to existing tests / code. For more details, please check the sections below:

## Table of contents
1. [Code of conduct](#code-of-conduct)

2. [How to contribute?](#how-to-contribute)
	1. [Bugs](#bugs)
		1. [Before submitting a bug report](#before-submitting-a-bug-report)
		2. [Good bug reports](#good-bug-reports)
	2. [Enhancements](#enhancements)
	3. [Pull requests](#pull-requests)

3. [Code style guides](#code-style-guides)
	1. [Git commit messages](#git-commit-style-guide)
	2. [JavaScript style guide](#javascript-style-guide)
	3. [Test styleguide](#specs-style-guide)
	4. [Documentation styleguide](#documentation-style-guide)

4. [Additional notes](#additional-notes)
	1. [Labels](#labels)

### How to contribute?

#### Bugs
This section guides you through submitting a bug report for express-boilerplate. Following these guidelines helps maintainers and the community understand your report,
reproduce the behavior, and find related reports. Before creating bug reports, please check this list as you might find out that you don't need to create one. When you
are creating a bug report, please include as many details as possible. If you'd like, you can use [this template](https://github.com/kunagpal/express-boilerplate/blob/master/.github/ISSUE_TEMPLATE.md)
to structure the information.

##### Before submitting a bug report
* Check the debugging guide. You might be able to find the cause of the problem and fix things yourself. Most importantly, check if you can reproduce the problem in the
latest version.

* Perform a cursory search to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.

##### Good bug reports
Bugs are tracked as GitHub issues. Create an issue [here](https://github.com/kunagpal/express-boilerplate/issues/new) and provide the following information.

* Use a clear and descriptive title for the issue to identify the problem.
* Describe the exact steps which reproduce the problem in as many details as possible.
* Provide specific examples to demonstrate the steps. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're
  providing snippets in the issue, use Markdown code blocks.
* Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
* Explain which behavior you expected to see instead and why.
* If the problem is related to performance, include a CPU profile capture and a screenshot with your report.
* Provide more context by answering these questions:
	* Can you reproduce the problem in safe mode?
	* Did the problem start happening recently (e.g. after updating to a new version of express-boilerplate) or was this always a problem?
	* If the problem started happening recently, can you reproduce the problem in an older version of express-boilerplate? What's the most recent version in which the
	  problem doesn't happen? You can download older versions of express-boilerplate from the releases page.
	* Can you reliably reproduce the issue? If not, provide details about how often the problem happens and under which conditions it normally happens.
	* If the problem is related to working with files (e.g. opening and editing files), does the problem happen for all files and projects or only some? Does the
	  problem happen only when working with local or remote files (e.g. on network drives), with files of a specific type (e.g. only JavaScript or Python files), with
	  large files or files with very long lines, or with files in a specific encoding? Is there anything else special about the files you are using?

* Include details about your configuration and environment:
	* Which version of express-boilerplate are you using?
	* What's the name and version of the OS you're using?
	* Are you running express-boilerplate in a virtual machine? If so, which VM software are you using and which operating systems and versions are used for the host
	  and the guest?

#### Enhancements
This section guides you through submitting an enhancement suggestion for express-boilerplate, including completely new features and minor improvements to existing
functionality. Following these guidelines helps maintainers and the community understand your suggestion, and find related suggestions. Before creating enhancement
suggestions, please check this list as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please include as many
details as possible. If you'd like, you can use [this template](https://github.com/kunagpal/express-boilerplate/blob/master/.github/ISSUE_TEMPLATE.md) to structure
the information.

##### Before Submitting An Enhancement Suggestion
* Check the debugging guide for tips — you might discover that the enhancement is already available. Also check if you're using the latest version of express-boilerplate.
* Check if there's already a package which provides that enhancement.
* Perform a cursory search to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

##### Good enhancement suggestions
Enhancement suggestions are tracked as GitHub issues. Create an issue on [here](https://github.com/kunagpal/express-boilerplate/issues/new)

* Use a clear and descriptive title for the issue to identify the suggestion.
* Provide a step-by-step description of the suggested enhancement in as many details as possible.
* Provide specific examples to demonstrate the steps. Include copy/pasteable snippets which you use in those examples, as Markdown code blocks.
* Describe the current behavior and explain which behavior you expected to see instead and why.
* Explain why this enhancement would be useful to most express-boilerplate users.
* List some other boilerplates / generators where this enhancement exists.
* Specify which version of express-boilerplate you're using.
* Specify the name and version of the OS you're using.

#### Pull requests
* Include screenshots and animated GIFs in your pull request whenever possible.
* Follow the JavaScript style guide described in the ESLint config.
* Include thoughtfully-worded, well-structured Mocha tests in the `test` folder. Run them using npm test. See the test style guide below.
* Document new code based on the documentation style guide
* End files with a newline.
* Place requires in the following order:
	* Built in Node Modules (such as path)
	* Built in express-boilerplate and express-boilerplate Shell Modules (such as express-boilerplate, shell)
	* Local Modules (using relative paths)
	* Keep a blank line between each set of requires.
* Avoid platform-dependent code:
	* Use path.join() to concatenate filenames.
	* Use os.tmpdir() rather than /tmp when you need to reference the temporary directory.
	* Using a plain return when returning explicitly at the end of a function.
* Not return null, return undefined, null, or undefined
* For more details, see the [pull request template](https://github.com/kunagpal/express-boilerplate/blob/master/.github/PULL_REQUEST_TEMPLATE.md)

### Code style guides

#### Git Commit Messages
* Use the past tense ("Added feature" not "Add feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 50 characters or less
* Reference issues and pull requests liberally
* When only changing documentation, include [ci skip] in the commit description
* Consider starting the commit message with an applicable emoji:
	* :art: `:art:` when improving the format/structure of the code
	* :racehorse: `:racehorse:` when improving performance
	* :non-potable_water: `:non-potable_water:` when plugging memory leaks
	* :memo: `:memo:` when writing docs
	* :penguin: `:penguin:` when fixing something on Linux
	* :apple: `:apple:` when fixing something on macOS
	* :checkered_flag: `:checkered_flag:` when fixing something on Windows
	* :bug: `:bug:` when fixing a bug
	* :fire: `:fire:` when removing code or files
	* :green_heart: `:green_heart:` when fixing the CI build
	* :white_check_mark: `:white_check_mark:` when adding tests
	* :lock: `:lock:` when dealing with security
	* :arrow_up: `:arrow_up:` when upgrading dependencies
	* :arrow_down: `:arrow_down:` when downgrading dependencies
	* :shirt: `:shirt:` when removing linter warnings

#### JavaScript style guide

#### Test style guide
* No two `it` blocks must have the same description.
* No two `describe` blocks must have the same description.
* Tests related to one method or flow must be placed in one `describe` block.

##### Structural tests
* These test look after project structure, and ensure that all configuration settings are in order.
* Any changes to project build / lint configuration should be accompanied by corresponding changes in their tests.
* These tests **do not** add to code test coverage metrics.

##### Unit tests
* All tests in `test/unit` should test one function, and one function only.
* Multiple `it` test blocks can test one function, but under different conditions.
* Unit tests contribute to code test coverage metrics.

###### End to end (E2E / integration) tests
* All tests in `test/e2e` should test a given branch in the functionality chain.
* Since these chains may involve multiple function invocations within them, these tests are kept separate from unit tests.
* These tests **do not** contribute toward code test coverage metrics.

#### Documentation style guide
* Use JSDoc
* Do run `npm run docs` locally to ensure that documentation generation is indeed valid.

### Additional notes

#### Labels
This section lists the labels we use to help us track and manage issues and pull requests. Some are specific to express-boilerplate. GitHub search makes it easy to use
labels for finding groups of issues or pull requests you're interested in. For example, you might be interested in open issues across express-boilerplate and all
express-boilerplate-owned packages which are labeled as bugs, but still need to be reliably reproduced or perhaps open pull requests in express-boilerplate which haven't
been reviewed yet. To help you find issues and pull requests, each label is listed with search links for finding open items with that label in express-boilerplate only and
also across all express-boilerplate repositories. We encourage you to read about other search filters which will help you write more focused queries.

The labels are loosely grouped by their purpose, but it's not required that every issue have a label from every group or that an issue can't have more than one label from
the same group. Please open an issue express-boilerplate if you have suggestions for new labels, and if you notice some labels are missing on some repositories, then please
open an issue on that repository.

#### Type of Issue and Issue State

| Label | Issues | Description |
| --- | --- | --- |
| `enhancement` | [search][search-repo-label-enhancement] | Feature requests. |
| `bug` | [search][search-repo-label-bug] | Confirmed bugs or reports that are very likely to be bugs. |
| `question` | [search][search-repo-label-question] | Questions more than bug reports or feature requests (e.g. how do I do X). |
| `feedback` | [search][search-repo-label-feedback] | General feedback more than bug reports or feature requests. |
| `help-wanted` | [search][search-repo-label-help-wanted] | The Atom core team would appreciate help from the community in resolving these issues. |
| `beginner` | [search][search-repo-label-beginner] | Less complex issues which would be good first issues to work on for users who want to contribute to Atom. |
| `more-information-needed` | [search][search-repo-label-more-information-needed] | More information needs to be collected about these problems or feature requests (e.g. steps to reproduce). |
| `needs-reproduction` | [search][search-repo-label-needs-reproduction] | Likely bugs, but haven't been reliably reproduced. |
| `blocked` | [search][search-repo-label-blocked] | Issues blocked on other issues. |
| `duplicate` | [search][search-repo-label-duplicate] | Issues which are duplicates of other issues, i.e. they have been reported before. |
| `wontfix` | [search][search-repo-label-wontfix] | The Atom core team has decided not to fix these issues for now, either because they're working as intended or for some other reason. |
| `invalid` | [search][search-repo-label-invalid] | Issues which aren't valid (e.g. user errors). |
| `package-idea` | [search][search-repo-label-package-idea] | Feature request which might be good candidates for new packages, instead of extending Atom or core Atom packages. |
| `wrong-repo` | [search][search-repo-label-wrong-repo] | Issues reported on the wrong repository (e.g. a bug related to the [Settings View package](https://github.com/atom/settings-view) was reported on [Atom core](https://github.com/atom/atom)). |

#### Topic Categories

| Label name | Issues | Description |
| --- | --- | --- |
| `windows` | [search][search-repo-label-windows] | Related to Atom running on Windows. |
| `linux` | [search][search-repo-label-linux] | Related to Atom running on Linux. |
| `mac` | [search][search-repo-label-mac] | Related to Atom running on macOS. |
| `documentation` | [search][search-repo-label-documentation] | Related to any type of documentation (e.g. [API documentation](https://atom.io/docs/api/latest/) and the [flight manual](http://flight-manual.atom.io/)). |
| `performance` | [search][search-repo-label-performance] | Related to performance. |
| `security` | [search][search-repo-label-security] | Related to security. |
| `ui` | [search][search-repo-label-ui] | Related to visual design. |
| `api` | [search][search-repo-label-api] | Related to Atom's public APIs. |
| `uncaught-exception` | [search][search-repo-label-uncaught-exception] | Issues about uncaught exceptions, normally created from the [Notifications package](https://github.com/atom/notifications). |
| `crash` | [search][search-repo-label-crash] | Reports of Atom completely crashing. |
| `auto-indent` | [search][search-repo-label-auto-indent] | Related to auto-indenting text. |
| `encoding` | [search][search-repo-label-encoding] | Related to character encoding. |
| `network` | [search][search-repo-label-network] | Related to network problems or working with remote files (e.g. on network drives). |
| `git` | [search][search-repo-label-git] | Related to Git functionality (e.g. problems with gitignore files or with showing the correct file status). |

#### `atom/atom` Topic Categories

| Label name | Issues | Description |
| --- | --- | --- |
| `editor-rendering` | [search][search-repo-label-editor-rendering] | Related to language-independent aspects of rendering text (e.g. scrolling, soft wrap, and font rendering). |
| `build-error` | [search][search-repo-label-build-error] | Related to problems with building Atom from source. |
| `error-from-pathwatcher` | [search][search-repo-label-error-from-pathwatcher] | Related to errors thrown by the [pathwatcher library](https://github.com/atom/node-pathwatcher). |
| `error-from-save` | [search][search-repo-label-error-from-save] | Related to errors thrown when saving files. |
| `error-from-open` | [search][search-repo-label-error-from-open] | Related to errors thrown when opening files. |
| `installer` | [search][search-repo-label-installer] | Related to the Atom installers for different OSes. |
| `auto-updater` | [search][search-repo-label-auto-updater] | Related to the auto-updater for different OSes. |
| `deprecation-help` | [search][search-repo-label-deprecation-help] | Issues for helping package authors remove usage of deprecated APIs in packages. |
| `electron` | [search][search-repo-label-electron] |  Issues that require changes to [Electron](https://electron.atom.io) to fix or implement. |

#### Core Team Project Management

| Label name | Issues | Description |
| --- | --- | --- |
| `atom` | [search][search-repo-label-atom] | Topics discussed for prioritization at the next meeting of Atom core team members. |

#### Pull Request Labels

| Label name | Issues | Description
| --- | --- | --- |
| `work-in-progress` | [search][search-repo-label-work-in-progress] | Pull requests which are still being worked on, more changes will follow. |
| `needs-review` | [search][search-repo-label-needs-review] | Pull requests which need code review, and approval from maintainers or Atom core team. |
| `under-review` | [search][search-repo-label-under-review] | Pull requests being reviewed by maintainers or Atom core team. |
| `requires-changes` | [search][search-repo-label-requires-changes] | Pull requests which need to be updated based on review comments and then reviewed again. |
| `needs-testing` | [search][search-repo-label-needs-testing] | Pull requests which need manual testing. |

[search-repo-label-enhancement]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aenhancement
[search-repo-label-bug]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Abug
[search-repo-label-question]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aquestion
[search-repo-label-feedback]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Afeedback
[search-repo-label-help-wanted]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Ahelp-wanted
[search-repo-label-beginner]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Abeginner
[search-repo-label-more-information-needed]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Amore-information-needed
[search-repo-label-needs-reproduction]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aneeds-reproduction
[search-repo-label-triage-help-needed]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Atriage-help-needed
[search-repo-label-windows]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Awindows
[search-repo-label-linux]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Alinux
[search-repo-label-mac]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Amac
[search-repo-label-documentation]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Adocumentation
[search-repo-label-performance]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aperformance
[search-repo-label-security]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Asecurity
[search-repo-label-ui]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aui
[search-repo-label-api]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aapi
[search-repo-label-crash]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Acrash
[search-repo-label-auto-indent]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aauto-indent
[search-repo-label-encoding]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aencoding
[search-repo-label-network]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Anetwork
[search-repo-label-uncaught-exception]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Auncaught-exception
[search-repo-label-git]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Agit
[search-repo-label-blocked]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Ablocked
[search-repo-label-duplicate]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aduplicate
[search-repo-label-wontfix]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Awontfix
[search-repo-label-invalid]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Ainvalid
[search-repo-label-package-idea]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Apackage-idea
[search-repo-label-wrong-repo]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Awrong-repo
[search-repo-label-editor-rendering]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aeditor-rendering
[search-repo-label-build-error]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Abuild-error
[search-repo-label-error-from-pathwatcher]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aerror-from-pathwatcher
[search-repo-label-error-from-save]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aerror-from-save
[search-repo-label-error-from-open]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aerror-from-open
[search-repo-label-installer]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Ainstaller
[search-repo-label-auto-updater]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aauto-updater
[search-repo-label-deprecation-help]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Adeprecation-help
[search-repo-label-electron]: https://github.com/issues?q=is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplateis%3Aopen+label%3Aelectron
[search-repo-label-atom]: https://github.com/issues?q=is%3Aopen+is%3Aissue+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aatom
[search-repo-label-work-in-progress]: https://github.com/pulls?q=is%3Aopen+is%3Apr+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Awork-in-progress
[search-repo-label-needs-review]: https://github.com/pulls?q=is%3Aopen+is%3Apr+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aneeds-review
[search-repo-label-under-review]: https://github.com/pulls?q=is%3Aopen+is%3Apr+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aunder-review
[search-repo-label-requires-changes]: https://github.com/pulls?q=is%3Aopen+is%3Apr+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Arequires-changes
[search-repo-label-needs-testing]: https://github.com/pulls?q=is%3Aopen+is%3Apr+repo%3Akunagpal%2Fexpress-boilerplatelabel%3Aneeds-testing

> This document has been heavily inspired from the [atom contribution guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md)