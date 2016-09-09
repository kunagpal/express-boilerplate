var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),
	yaml = require('js-yaml'),

	travisPath = path.join(__dirname, '..', '..', '.travis.yml');

describe('.travis.yml', function () {
	var travisYAML;

	before(function () {
		try {
			travisYAML = yaml.safeLoad(fs.readFileSync(travisPath, 'utf-8'));
		}
		catch (err) {
			throw err;
		}
	});

	it('should exist', function (done) {
		fs.stat(travisPath, done);
	});

	it('should have a language field with value node_js', function () {
		assert(travisYAML.language === 'node_js', 'Travis build language is not set to node_js');
	});

	it('should have builds set for Node v4, v5, and v6', function () {
		assert.deepStrictEqual(travisYAML.node_js, ['4', '5', '6'], 'Travis is not set to run builds on Node v4, 5, 6');
	});
});
