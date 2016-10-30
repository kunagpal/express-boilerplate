var fs = require('fs'),

	yaml = require('js-yaml'),

	ENCODING = 'utf-8',
	YAML_LOAD_ERROR = 'The specified file does not exist, or is invalid YAML';

exports.ymlToJson = function (path) {
	var json = {};

	try {
		json = yaml.safeLoad(fs.readFileSync(path, ENCODING)); // eslint-disable-line no-sync
	}
	catch (err) {
		console.error(YAML_LOAD_ERROR);
	}

	return json;
};
