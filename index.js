
/**
 *   Bracket Text templete renderer
 *
 *   Template Syntax:   [ {prefix}-_.{property} : {default} ]
 */

var util = require('util');

var defaults = {
    prefix:     "object"
};


var renderData = function renderData(textString, prefix, data) {
    var pattern, replacer = function replacer(match, $1, $2){
		var key = $1 || '$NO_KEY_NULL_KEY$'
		key = key.trim();
		var defaultValue = $2 || '';
		defaultValue = defaultValue.trim();
		return data[key] || data[key.replace(/[\-\_\.]/,' ')] || defaultValue;
	};
    if(typeof prefix === 'string' && typeof data === 'object') {
        pattern = new RegExp('\\[(?:\\s*'+prefix.trim()+'[\\.\\-\\_]([\\w\\-\\.]+)\\s*)(?:\\:([^\\[\\]]+))?\\]', 'g');
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

	if(arguments.length === 3 && typeof arguments[2] === 'function') {
		callback = arguments[2];
		options = false;
	}

	options = getDefaults(options);

	var textString = '';

	if(content && dataObj) {
		textString = String(content);

		textString = renderData(textString, options.prefix, dataObj);

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
