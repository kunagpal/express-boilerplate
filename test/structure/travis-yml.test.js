var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	utils = require(path.join(__dirname, '..', '..', 'utils', 'test')),

	TRAVIS_PATH = '.travis.yml';

describe(TRAVIS_PATH, function () {
	var travisYAML = utils.ymlToJson(TRAVIS_PATH);

	it('should exist', function (done) {
		fs.stat(TRAVIS_PATH, done);
	});

	it('should have sudo required', function () {
		assert(travisYAML.sudo === 'required', 'Travis build configuration may not have sudo required');
	});

	it('should have a language field with value node_js', function () {
		assert(travisYAML.language === 'node_js', 'Travis build language is not set to node_js');
	});

	it('should have builds set for Node v4-7', function () {
		assert.deepStrictEqual(travisYAML.node_js, ['4', '5', '6', '7'], 'Travis is not set for builds on Node v4-7');
	});

	describe('addons', function () {
		var addons = travisYAML.addons.apt;

		it('should have the correct ubuntu toolchain as in sources', function () {
			assert.deepStrictEqual(addons.sources, ['ubuntu-toolchain-r-test'], 'Incorrect build toolchain specified');
		});

		it('should have the g++ 4.8 listed as a package', function () {
			assert.deepStrictEqual(addons.packages, ['g++-4.8'], 'Incorrect build package specified');
		});
	});

	it('should clean the npm cache before installing', function () {
		assert.deepStrictEqual(travisYAML.before_install, ['npm cache clean'], 'Cache may have been left intact');
	});
});
