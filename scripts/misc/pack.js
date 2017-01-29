/**
 * @file Minifies static assets in the public folder.
 */

var fs = require('fs'),
	path = require('path'),

	async = require('async'),
	uglifyJs = require('uglify-js'),
	CleanCSS = require('clean-css'),

	cleanCss = new CleanCSS(),

	ASSET_PATH = path.join(__dirname, '..', '..', 'public'),
	TARGET_DIR = path.join(ASSET_PATH, 'min'),
	SCRIPTS = path.join(ASSET_PATH, 'javascripts'),
	STYLES = path.relative(process.cwd(), path.join('public', 'stylesheets')),
	JS_OPTIONS = {
		mangle: true,
		mangleProperties: true,
		compress: {
			properties: true,
			dead_code: true, // eslint-disable-line camelcase
			drop_debugger: true, // eslint-disable-line camelcase
			conditionals: true,
			evaluate: true,
			booleans: true,
			loops: true,
			unused: true,
			hoist_funs: true, // eslint-disable-line camelcase
			if_return: true, // eslint-disable-line camelcase
			join_vars: true, // eslint-disable-line camelcase
			cascade: true,
			collapse_vars: true, // eslint-disable-line camelcase
			pure_getters: true, // eslint-disable-line camelcase
			drop_console: true, // eslint-disable-line camelcase
			unsafe: true
		}
	};

try {
	fs.mkdirSync(TARGET_DIR); // eslint-disable-line no-sync
}
catch (err) {
	console.warn(`${TARGET_DIR} already exists`);
}

/**
 * Parallely minifies javascript and stylesheets in SCRIPTS and STYLES respectively.
 *
 * @param {Function} next - The callback whose invocation marks the end of the minifacation routine.
 */
module.exports = function (next) {
	async.parallel({

		/**
		 * Handles the minification of front end javascript in SCRIPTS.
		 *
		 * @param {Function} done - The callback that marks the completion of the JS minification routine.
		 */
		js: function (done) {
			return fs.readdir(SCRIPTS, function (err, scripts) {
				if (err) {
					return done(err);
				}

				async.each(scripts, function (script, callback) {
					// eslint-disable-next-line max-len
					fs.writeFile(path.join(TARGET_DIR, script), uglifyJs.minify(path.join(SCRIPTS, script), JS_OPTIONS).code,
						callback);
				}, done);
			});
		},

		/**
		 * Minifies stylesheets in the STYLES directory.
		 *
		 * @param {Function} done - The callback that marks the end of the stylesheet minification routine.
		 */
		css: function (done) {
			return fs.readdir(STYLES, function (err, styles) {
				if (err) {
					return done(err);
				}

				async.each(styles, function (style, callback) {
					// eslint-disable-next-line max-len
					fs.writeFile(path.join(TARGET_DIR, style), cleanCss.minify([path.join(STYLES, style)]).styles, callback);
				}, done);
			});
		}
	}, next);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
