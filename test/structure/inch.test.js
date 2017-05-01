var inch = require(path.resolve('inch'));

describe('Inch CI configuration', function () {
	it('should have a valid files property', function () {
		assert(inch.files, 'Inch CI does not have a valid files property');
	});

	it('should have a valid set of included files', function () {
		assert.deepStrictEqual(inch.files.included, [
			'app.js',
			'bin/**/*.js',
			'database/**/*.js',
			'scripts/**/*.js',
			'utils/**/*.js',
			'public/**/*.js'
		], 'Inch CI does not have a valid files property');
	});

	it('should have a valid set of excluded files', function () {
		assert.deepStrictEqual(inch.files.excluded, [
			'node_modules/**/*.js',
			'views/**/*.js',
			'test/**/*.js'
		], 'Inch CI does not have a valid files property');
	});
});
