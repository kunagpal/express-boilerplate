describe('/ routes', function () {
	it('should return a valid response for the root route', function (done) {
		test
			.get('/')
			.expect(200)
			.expect('Content-Type', 'text/html; charset=utf-8')
			.end(done);
	});
});
