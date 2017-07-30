/**
 * @file Contains re-usable test helpers.
 */

/* globals it */
var fs = require('fs'),
	assert = require('assert'),

	_ = require('lodash'),
	yaml = require('js-yaml'),

	ENCODING = 'utf-8';

exports.db = require('./database');

/**
 * Checks whether the provided object is a non-empty array.
 *
 * @param {*} arr - The object to be checked.
 * @returns {Boolean} - A flag to indicate that the provided object is a non-empty array.
 */
exports.isNonEmptyArray = function (arr) {
	return _.isArray(arr) && !_.isEmpty(arr);
};

/**
 * Converts YAMl to JSON.
 *
 * @param {String} yamlPath - The path of the file to parse YAMl from.
 * @returns {Object} The JSON representation of the provided YAML file.
 */
exports.ymlToJson = function (yamlPath) {
	var json = {};

	try {
		json = yaml.safeLoad(fs.readFileSync(yamlPath, ENCODING)); // eslint-disable-line no-sync
	}
	catch (err) {} // eslint-disable-line no-empty

	return json;
};

/**
 * Checks the provided contributors object for sanity.
 *
 * @param {Object[]} contributors - A set of contributor details.
 * @returns {Function} A test suite related to package contributor checks.
 */
exports.checkContributors = function (contributors) {
	return function () {
		it('should exist and be an array', function () {
			assert(_.isArray(contributors), 'Project contributor details missing / in non array form');
		});

		it('should have a non-zero length', function () {
			assert(!_.isEmpty(contributors), 'Project contributors section is empty');
		});

		it('should contain valid contributor details', function () {
			_.forEach(contributors, function (contributor, index) {
				assert(contributor.name, `Project contributor ${index} name missing`);
				assert(/@.+\./i.test(contributor.email), `Project contributor ${index} email invalid`);
			});
		});
	};
};
