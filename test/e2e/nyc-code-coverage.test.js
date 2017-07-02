describe('Code coverage computation', function () {
	var coverageDir = '.coverage';

	it('should create a valid .coverage directory', function (done) {
		fs.readdir(coverageDir, function (err, contents) {
			assert.deepStrictEqual(err, null, `The ${coverageDir} directory may not exist`);
			assert(_.isArray(contents) && !_.isEmpty(contents), `${coverageDir} must be a non-empty directory`);
			assert(_.includes(contents, 'lcov.info'), 'Coverage generation must use the lcov operator');
			assert(_.includes(contents, 'lcov-report'), 'Coverage generation must use the lcov operator');

			assert(fs.statSync(path.join(coverageDir, 'lcov-report')).isDirectory(), // eslint-disable-line no-sync
				`${coverageDir}/lcov-report must be a directory`);
			assert(!_.isEmpty(fs.readdirSync(path.join(coverageDir, 'lcov-report'))), // eslint-disable-line no-sync
				`${coverageDir}/lcov-report must be a directory`);
			done();
		});
	});
});
