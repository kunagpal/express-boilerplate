var parseIgnore = require('parse-gitignore');

describe('.ignore files', function () {
	var gitignorePath = '.gitignore';

	describe(gitignorePath, function () {
		var gitignore = parseIgnore(gitignorePath),
			ignored = ['logs', '*.log', 'npm-debug.log*', 'pids', '*.pid', '*.seed', 'lib-cov', 'coverage',
				'.nyc_output', '.grunt', '.lock-wscript', 'build/Release', 'node_modules', 'public/bower', '.npm',
				'.node_repl_history', '.idea/**', '.env', 'public/min', 'out'];

		it('should exist', function (done) {
			fs.stat(gitignorePath, done);
		});

		it('should ignore all basic entities', function () {
			assert.deepEqual(_.intersection(gitignore, ignored), ignored, 'Invalid .gitignore!');
		});
	});
});
