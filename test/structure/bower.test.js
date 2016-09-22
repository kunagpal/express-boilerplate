var url = require('url'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash');

describe('bower', function () {
	var rootPath = path.join(__dirname, '..', '..'),
		bowerJSON = require(path.join(rootPath, 'bower.json')); // eslint-disable-line global-require

	describe('glossary', function () {
		it('should have a name', function () {
			assert.ok(bowerJSON.name, 'Project name is empty / non-existent');
		});

		it('should contain a valid description', function () {
			assert.ok(bowerJSON.description, 'Project description is missing');
		});

		it('should be defined privately', function () {
			assert(bowerJSON.private, true, 'Project may have been public to the npm registry');
		});

		it('should have a non empty list of keywords', function () {
			assert(_.isArray(bowerJSON.keywords) && !_.isEmpty(bowerJSON.keywords),
                'Project may have been public to the npm registry');
		});
	});

	describe('authors', function () {
		var bowerContributors = bowerJSON.authors;

		it('should exist and be an array', function () {
			assert(_.isArray(bowerContributors), 'Project contributor details missing / in non array form');
		});

		it('should have a non-zero length', function () {
			assert(!_.isEmpty(bowerContributors), 'Project contributors section is empty');
		});

		it('should contain valid contributor details', function () {
			_.forEach(bowerContributors, function (contributor, index) {
				assert(contributor.name, `Project contributor ${index} name missing`);
				assert(/@.+\./i.test(contributor.email), `Project contributor ${index} email invalid`);
			});
		});
	});

	describe.skip('dependencies', function () { // eslint-disable-line mocha/no-skipped-tests
		var bowerDependencies = _.pick(bowerJSON, ['dependencies', 'devDependencies', 'optionalDependencies']);

		it('should exist and be an object', function () {
			assert(!_.isEmpty(bowerDependencies) && _.isObject(bowerDependencies), 'Project has no dependencies');
		});

		it('should have precise dependency versions', function () {
			_.forEach(bowerDependencies, function (dependencies, type) {
				_.forEach(dependencies, function (version, name) {
					assert(/^\d/.test(version), `${type}: ${name}@${version} is invalid`);
				});
			});
		});

		it('should have the same versions across bower.json and public/bower', function () {
			var dependencyPath = path.join(rootPath, 'public', 'bower'),
				dependencies = _.merge({}, bowerDependencies.dependencies, bowerDependencies.devDependencies,
				bowerDependencies.optionalDependencies, bowerDependencies.peerDependencies);

			_.forEach(dependencies, function (specifiedVersion, dependency) {
				// eslint-disable-next-line global-require
				var installedVersion = require(path.join(dependencyPath, dependency, 'package.json')).version;

				assert(specifiedVersion === installedVersion,
					`${dependency} is specified as ${specifiedVersion}, but installed as ${installedVersion}`);
			});
		});
	});

	it('should point to a valid homepage', function () {
		assert(url.parse(bowerJSON.homepage), 'Project repository url does not point to a valid URL');
	});

	it('should have a valid list of ignored entities', function () {
		assert(_.isArray(bowerJSON.ignore) && !_.isEmpty(bowerJSON.ignore), 'Project engine is invalid');
	});
});
