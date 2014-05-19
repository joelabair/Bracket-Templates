
/**
 *   Bracket Text templete renderer
 *
 *   Template Syntax:   [ {prefix}-_.{property} : {default} ]
 */

var util = require('util');

var defaults = {
    prefix: "object"
};


var renderData = function renderData(textString, prefix, data) {
    var pattern, replacer = function replacer(match, $1, $2){
		var key = $1 || '$NO_KEY_NULL_KEY$', dataValue = '', defaultValue = $2 || '';
		dataValue = data[key] || data[key.trim()] || data[key.replace(/[\-\_\.]/,' ')];
		defaultValue = ($2 || '').trim();
		if (typeof dataValue === 'object') {
			return match;
		}
		return dataValue || defaultValue || match;
	};
    if(typeof data === 'object') {
		if (prefix && typeof prefix === 'string') {
			pattern = new RegExp('\\[(?:\\s*'+prefix.trim()+'[\\.\\-\\_]([\\w\\-\\.]+)\\s*)(?:\\:([^\\[\\]]+))?\\]', 'g');
		} else {
			pattern = new RegExp('\\[(?:\\s*([\\w\\-\\.]+)\\s*)(?:\\:([^\\[\\]]+))?\\]', 'g');
		}
		textString = textString.replace(pattern, replacer);
    }
	return textString;
};


 var getDefaults = function getDefaults(options) {
	var obj = Object.create(defaults);
	for ( var prop in defaults ) {
		if ( defaults.hasOwnProperty(prop) ) {
			Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(defaults, prop));
		}
	}
	if ( typeof options === 'object' ) {
		obj = util._extend(obj, options);
	}
	return obj;
};


exports.render = function render(content, dataObj, options, callback) {

	var textString = '', retBuffer = false;

	if(arguments.length === 3 && typeof arguments[2] === 'function') {
		callback = arguments[2];
		options = false;
	}

	options = getDefaults(options);

	if (Buffer.isBuffer(content)) {
		retBuffer = true;
	}

	if(content && dataObj) {
		textString = renderData(String(content), options.prefix, dataObj);

		if (retBuffer) {
			// buffer in buffer out.
			textString = new Buffer(textString);
		}

		if(callback) {
			return callback(null, textString);
		}
		return textString;
	} else {
		if(callback) {
			return callback(null, content);
		}
		return content;
	}

};
