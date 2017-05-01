var start = require(path.resolve('./scripts/app/start')),
	stop = require(path.resolve('./scripts/app/stop'));

describe('App scripts', function () {
	describe('start', function () {
		afterEach(stop);

		it('should work correctly', start);
	});

	describe('stop', function () {
		beforeEach(start);

		it('should work correctly', stop);
	});
});
