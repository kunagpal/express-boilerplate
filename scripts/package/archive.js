#!/usr/local/bin/node

/* eslint-disable security/detect-child-process */
var fs = require('fs'),
	path = require('path'),
	child = require('child_process'),

	async = require('async'),
	chalk = require('chalk');

/**
 * Creates a zip archive of the form <commit>-<reduced branch name>.zip in out/archive.
 *
 * @param {Function} done - The callback invoked to mark the end of the archiving process.
 */
module.exports = function (done) {
	async.waterfall([
		// Ignore directory creation errors if any (the target dir already exists)
		async.reflect(async.apply(fs.mkdir, 'out')),
		async.reflect(async.apply(fs.mkdir, 'out/archive')),

		async.apply(child.exec, 'git describe --always'), // fetch the hash of the most recent commit

		/**
		 * Constructs a file name using the most recent commit and the acquired current branch name.
		 *
		 * @param {String} commit - The unique SHA1 hash of the latest commit.
		 * @param {String} meta - An error stub passed on from the previous step in the waterfall.
		 * @param {Function} next - The callback invoked to indicate the end of the filename construction routine.
		 */
		function (commit, meta, next) {
			child.exec('git rev-parse --abbrev-ref HEAD', function (err, branch) {
				if (err) { return next(err); }

				next(null, `${commit.trimRight()}-${branch.trimRight().replace(/^\w+\/(.+)$/, '$1')}.zip`);
			});
		},

		/**
		 * Creates a git archive in out/archive with the provided filename.
		 *
		 * @param {String} file - The processed filename for the zip archive.
		 * @param {Function} next - The callback to mark the completion of the archive process.
		 */
		function (file, next) {
			var target = path.join('out', 'archive', file);

			child.exec(`git archive --format zip -9 --output ${target} HEAD`, function (err) {
				if (err) { return next(); }

				!module.parent && console.info(chalk.blue.bold(`Successfully created archive at ${target}`));
				next();
			});
		}
	], done);
};

!module.parent && module.exports(process.exit);
