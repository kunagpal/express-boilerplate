var fs = require('fs'),
	assert = require('assert'),

	_ = require('lodash'),
	parseIgnore = require('parse-gitignore');

describe('.ignore files', function () {
	var gitignorePath = '.gitignore';

	describe(gitignorePath, function () {
		var gitignore = parseIgnore(gitignorePath),
			ignored = ['*.log', '*.pid', '*.seed', '.env', '.grunt', '.idea/**', '.lock-wscript', '.node_repl_history',
				'.npm', '.nyc_output', 'build/Release', 'coverage', 'lib-cov', 'logs', 'node_modules', 'npm-debug.log*',
				'pids', 'public/bower', 'public/min'];

		it('should exist', function (done) {
			fs.stat(gitignorePath, done);
		});

		it('should ignore all basic entities', function () {
			assert.deepStrictEqual(_.intersection(gitignore, ignored), ignored, 'Invalid .gitignore!');
		});
	});
});
