var fs = require('fs'),
	assert = require('assert'),

	_ = require('lodash'),
	parseIgnore = require('parse-gitignore');

describe('.ignore files', function () {
	var gitignorePath = '.gitignore';

	describe(gitignorePath, function () {
		var gitignore = parseIgnore(gitignorePath);

		it('should exist', function (done) {
			fs.stat(gitignorePath, done);
		});

		it('should ignore log files', function () {
			assert(_.includes(gitignore, '*.log'), 'Log files might be added to commits!');
			assert(_.includes(gitignore, 'logs'), 'Log files might be added to commits!');
			assert(_.includes(gitignore, 'logs/**'), 'Log files might be added to commits!');
			assert(_.includes(gitignore, 'npm-debug.log*'), 'npm debug logs might be added to commits!');
		});

		it('should ignore environment specific configuration', function () {
			assert(_.includes(gitignore, '.env'), '.env might be added to commits!');
			assert(_.includes(gitignore, '.env/**'), '.env might be added to commits!');
		});

		it('should ignore installed dependencies', function () {
			assert(_.includes(gitignore, 'node_modules'), 'node_modules might be added to commits!');
			assert(_.includes(gitignore, 'node_modules/**'), 'node_modules might be added to commits!');
			assert(_.includes(gitignore, 'public/bower'), 'Bower components might be added to commits!');
			assert(_.includes(gitignore, 'public/bower/**'), 'Bower components might be added to commits!');
		});

		it('should ignore unit test coverage information', function () {
			assert(_.includes(gitignore, 'coverage'), 'test coverage might be added to commits!');
			assert(_.includes(gitignore, 'coverage/**'), 'test coverage might be added to commits!');
		});

		it('should ignore grunt related entities', function () {
			assert(_.includes(gitignore, '.grunt'), 'grunts might be added to commits!');
			assert(_.includes(gitignore, '.grunt/**'), 'grunts coverage might be added to commits!');
		});

		it('should ignore minified static assets', function () {
			assert(_.includes(gitignore, 'public/min'), 'minified assets might be added to commits!');
			assert(_.includes(gitignore, 'public/min/**'), 'minified assets might be added to commits!');
		});

		it('should ignore IDE project metadata manifiests', function () {
			assert(_.includes(gitignore, '.idea/**'), '.idea might be added to commits!');
		});
	});
});
