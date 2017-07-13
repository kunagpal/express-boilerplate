describe('Project structure', function () {
	describe('files', function () {
		[
			'.csslintrc', '.editorconfig', '.eslintignore', '.eslintrc', '.gitattributes', '.github/CODE_OF_CONDUCT.md',
			'.github/CONTRIBUTING.md', '.github/ISSUE_TEMPLATE.md', '.github/PULL_REQUEST_TEMPLATE.md', '.gitignore',
			'.jsdocrc', 'Procfile', 'README.md', 'app.js', 'inch.json'
		]
			.forEach(function (file) {
				it(`should have a valid ${file}`, function (done) {
					fs.readFile(file, function (err, content) {
						assert.strictEqual(err, null, `${file} may not exist as a file`);
						assert.strictEqual(!_.isEmpty(content), true, `${file} is empty`);

						done();
					});
				});
			});
	});

	describe('directories', function () {
		['.git', 'node_modules', 'public', 'routes', 'scripts', 'test', 'utils', 'views'].forEach(function (d) {
			it(`should have a valid ${d}`, function (done) {
				fs.readdir(d, function (err, contents) {
					assert.strictEqual(err, null, `${d} might not exist as a directory`);
					assert(!_.isEmpty(contents), true, `${d} is empty`);

					done();
				});
			});
		});
	});
});
