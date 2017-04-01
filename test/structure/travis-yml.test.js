var TRAVIS_PATH = '.travis.yml';

describe(TRAVIS_PATH, function () {
	var travisYAML = testUtils.ymlToJson(TRAVIS_PATH);

	it('should exist', function (done) {
		fs.stat(TRAVIS_PATH, done);
	});

	it('should run builds on linux and osx', function () {
		assert.deepStrictEqual(travisYAML.os, ['linux', 'osx'], 'Travis builds are not set to linux and osx');
	});

	it('should use gcc and clang compilers respectively', function () {
		assert.deepStrictEqual(travisYAML.compiler, ['gcc', 'clang'], 'Travis build compilers not set to gcc, clang');
	});

	it('should have a language field with value node_js', function () {
		assert.strictEqual(travisYAML.language, 'node_js', 'Travis build language is not set to node_js');
	});

	it('should have builds set for Node v4-7', function () {
		assert.deepStrictEqual(travisYAML.node_js, ['4', '5', '6', '7'], 'Travis is not set for builds on Node v4-7');
	});

	it('should run on master and develop only', function () {
		assert.deepStrictEqual(travisYAML.branches.only, ['master', 'develop'], 'Non master/develop branches included');
	});

	describe('addons', function () {
		var addons = travisYAML.addons;

		it('should have the correct ubuntu toolchain as in sources', function () {
			assert.deepStrictEqual(addons.apt.sources, ['mongodb-3.4-precise', 'ubuntu-toolchain-r-test'],
				'Incorrect build toolchain');
		});

		it('should have the g++ 4.8 listed as a package', function () {
			assert.deepStrictEqual(addons.apt.packages, ['g++-4.8', 'mongodb-org-server'],
				'Incorrect build package specified');
		});

		it('should have a secured codeclimate repository token', function () {
			assert(/^.+$/.test(addons.code_climate.repo_token.secure), 'Invalid codeclimate repo token');
		});
	});

	it('should use mongodb as a service', function () {
		assert.deepStrictEqual(travisYAML.services, ['mongodb'], 'MongoDB may not be used');
	});

	it('should cache the node_modules', function () {
		assert.deepStrictEqual(travisYAML.cache.directories, ['node_modules'], 'Caching may be invalid');
	});
});
