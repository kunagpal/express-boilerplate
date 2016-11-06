var assert = require('assert'),
	editorconfig = require('editorconfig'),

	TAB_WIDTH = 4,
	MAX_LINE_LENGTH = 120;

describe('.editorconfig', function () {
	var config = editorconfig.parseSync('.editorconfig'); // eslint-disable-line no-sync

	it('should have a tab_width of 4', function () {
		assert(config.tab_width === TAB_WIDTH, 'Tab width set to non 4 value!');
	});

	it('should have a charset of utf-8', function () {
		assert(config.charset === 'utf-8', 'Charset set to non "utf-8" value!');
	});

	it('should have an indent_size of 4', function () {
		assert(config.indent_size === TAB_WIDTH, 'Indent size set to non 4 value!');
	});

	it('should have a max_line_length of 120', function () {
		assert(config.max_line_length === MAX_LINE_LENGTH, 'Line length set to non 120 value!');
	});

	it('should have an indent_style of 4', function () {
		assert(config.indent_style === 'tab', 'Indent style set to non "tab" value!');
	});

	it('should have a falsy insert_final_newline value', function () {
		assert(config.insert_final_newline === false, 'Tab width set to non truthy value!');
	});

	it('should have a truthy trim_trailing_whitespace', function () {
		assert(config.trim_trailing_whitespace === true, 'Tab width set to falsy value!');
	});
});
