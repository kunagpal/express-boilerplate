#!/usr/bin/env node

var fs = require('fs'),

	jsdoc2md = require('jsdoc-to-markdown');

module.exports = function (done) {
	// eslint-disable-next-line no-sync, no-empty, brace-style
	try { fs.mkdirSync('out'); } catch (e) {}
	// eslint-disable-next-line no-sync, no-empty, brace-style
	try { fs.mkdirSync('out/wiki'); } catch (e) {}

	jsdoc2md.render({ files: ['bin/**/*.js', 'database/**/*.js', 'scripts/**/*.js', 'utils/**/*.js'] })
		.then(function (markdown) {
			fs.writeFile('out/wiki/REFERENCE.md', markdown, done);
		}, done)
		.catch(done);
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
