var makeWiki = require(path.resolve('./scripts/docs/make-wiki'));

describe('Wiki generation', function () {
	var file = 'out/wiki/REFERENCE.md',
		cleanup = function () {
			try { fs.unlinkSync(file); } catch (e) {} // eslint-disable-line no-empty, brace-style, no-sync
			try { fs.rmdirSync('out/wiki'); } catch (e) {} // eslint-disable-line no-empty, brace-style, no-sync
			try { fs.rmdirSync('out'); } catch (e) {} // eslint-disable-line no-empty, brace-style, no-sync
		};

	before(cleanup);
	after(cleanup);

	it('should work correctly', function (done) {
		makeWiki(function (err) {
			fs.readFile(file, 'utf8', function (error, data) {
				assert(data.length, `Wiki at ${file} is invalid`);
				done(error || err);
			});
		});
	});
});
