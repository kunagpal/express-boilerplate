/* globals it */
var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	async = require('async'),
	Mocha = require('mocha'),
	yaml = require('js-yaml'),
	readDir = require('recursive-readdir'),

	ENCODING = 'utf-8',
	TEST_FILE_PATTERN = '.test.js',
	YAML_LOAD_ERROR = 'The specified file does not exist, or is invalid YAML',
	PACKAGES = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'bundledDependencies'];

exports.ymlToJson = function (yamlPath) {
	var json = {};

	try {
		json = yaml.safeLoad(fs.readFileSync(yamlPath, ENCODING)); // eslint-disable-line no-sync
	}
	catch (err) {
		console.error(YAML_LOAD_ERROR);
	}

	return json;
};

exports.checkContributors = function (contributors) {
	return function () {
		it('should exist and be an array', function () {
			assert(_.isArray(contributors), 'Project contributor details missing / in non array form');
		});

		it('should have a non-zero length', function () {
			assert(!_.isEmpty(contributors), 'Project contributors section is empty');
		});

		it('should contain valid contributor details', function () {
			_.forEach(contributors, function (contributor, index) {
				assert(contributor.name, `Project contributor ${index} name missing`);
				assert(/@.+\./i.test(contributor.email), `Project contributor ${index} email invalid`);
			});
		});
	};
};

exports.checkDependencies = function (packageJson, mode) {
	mode = mode || 'package';
	var packageDependencies = _.pick(packageJson, PACKAGES);

	return function () {
		it('should exist and be an object', function () {
			assert(!_.isEmpty(packageDependencies) && _.isObject(packageDependencies), 'Project has no dependencies');
		});

		it('should have precise dependency versions', function () {
			_.forEach(packageDependencies, function (dependencies, type) {
				_.forEach(dependencies, function (version, name) {
					assert(/^\d/.test(version), `${type}: ${name}@${version} is invalid`);
				});
			});
		});

		it('should have the same versions across package.json and node_modules', function () {
			var isBower = mode === 'bower',
				dependencyPath = path.join(__dirname, '..', '..', isBower ? path.join('public', 'bower')
					: 'node_modules');

			_.forEach(packageDependencies, function (dependencies) {
				_.forEach(dependencies, function (specified, dependency) {
					if (isBower || dependency !== 'bcrypt') {
						// eslint-disable-next-line global-require
						var installed = require(path.join(dependencyPath, dependency, 'package.json')).version;

						assert.strictEqual(specified, installed, `Need ${dependency} ${specified}, found ${installed}`);
					}
				});
			});
		});
	};
};

exports.runTests = function (testDir, done) {
	async.waterfall([
		function (next) {
			readDir(testDir, next);
		},
		function (files, next) {
			next(null, _.filter(files, function (file) {
				return _.endsWith(file, TEST_FILE_PATTERN);
			}));
		},
		function (tests, next) {
			var mocha = new Mocha();

			_.forEach(tests, mocha.addFile.bind(mocha));

			next(null, mocha);
		},
		function (mocha, next) {
			_.merge(global, {
				_: _,
				fs: fs,
				path: path,
				assert: assert,
				utils: exports
			});

			mocha.run(next);
		}
	], done);
};
