describe('/ routes', function () {
	it('should return a valid response for the root route', function (done) {
		test
			.get('/')
			.expect(200)
			.expect('x-frame-options', 'SAMEORIGIN')
			.expect('strict-transport-security', 'max-age=15552000; includeSubDomains')
			.expect('x-download-options', 'noopen')
			.expect('x-content-type-options', 'nosniff')
			.expect('x-xss-protection', '1; mode=block')
			.expect('content-type', 'text/html; charset=utf-8')
			.expect('vary', 'Accept-Encoding')
			.expect('connection', 'close')
			.end(done);
	});

	it('should return a not found response for an arbitrary route', function (done) {
		test
			.get('/random')
			.expect(404)
			.expect('x-frame-options', 'SAMEORIGIN')
			.expect('strict-transport-security', 'max-age=15552000; includeSubDomains')
			.expect('x-download-options', 'noopen')
			.expect('x-content-type-options', 'nosniff')
			.expect('x-xss-protection', '1; mode=block')
			.expect('content-type', 'text/html; charset=utf-8')
			.expect('vary', 'Accept, Accept-Encoding')
			.expect('connection', 'close')
			.end(done);
	});
});
