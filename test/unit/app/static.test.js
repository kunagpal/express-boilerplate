describe('static asset routes', function () {
	describe('scripts', function () {
		// eslint-disable-next-line no-sync
		fs.readdirSync('public/javascripts').forEach(function (script) {
			_.endsWith(script, '.js') && it(`should load ${script} correctly`, function (done) {
				test
					.get(`/static/${script}`)
					.expect('accept-ranges', 'bytes')
					.expect('x-frame-options', 'SAMEORIGIN')
					.expect('strict-transport-security', 'max-age=15552000; includeSubDomains')
					.expect('x-download-options', 'noopen')
					.expect('x-content-type-options', 'nosniff')
					.expect('x-xss-protection', '1; mode=block')
					.expect('content-type', 'text/javascript; charset=utf-8')
					.expect('vary', 'Accept-Encoding')
					.expect('connection', 'close')
					.expect(200, done);
			});
		});
	});

	describe('styles', function () {
		// eslint-disable-next-line no-sync
		fs.readdirSync('public/stylesheets').forEach(function (style) {
			_.endsWith(style, '.css') && it(`should load ${style} correctly`, function (done) {
				test
					.get(`/static/${style}`)
					.expect('accept-ranges', 'bytes')
					.expect('x-frame-options', 'SAMEORIGIN')
					.expect('strict-transport-security', 'max-age=15552000; includeSubDomains')
					.expect('x-download-options', 'noopen')
					.expect('x-content-type-options', 'nosniff')
					.expect('x-xss-protection', '1; mode=block')
					.expect('content-type', 'text/css; charset=UTF-8')
					.expect('vary', 'Accept-Encoding')
					.expect('connection', 'close')
					.expect(200, done);
			});
		});
	});
});
