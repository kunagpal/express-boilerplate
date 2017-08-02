/**
 * @file Contains re-usable test helpers.
 */

var fs = require('fs'),

	yaml = require('js-yaml'),

	ENCODING = 'utf-8';

exports.db = require('./database');

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
