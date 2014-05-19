
/**
 *   Bracket Text templete renderer
 *
 *   Template Syntax:   [ {prefix}-_.{property} : {default} ]
 */

var util = require('util');

// todo: support a map of prefix names to object properties
var defaults = {
    prefix: "object"
};


/**
 *  Text tag renderer
 *
 *  @param {String} 	textString 	The template string.
 *  @param {String}  	prefix 			The tag prefix if any.
 *  @param {Object} 	data 			The source keys and values as an object.
 *  @returns {String}
 */
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


/**
 *  Return options inheriting form the module defaults.
 *
 *  @param {Object} 	options 	Custom options passed in.
 *  @returns {Object}
 */
 var getOptions = function getOptions(options) {
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


/**
 *  Render a square bracket text template.
 *
 *  @param {String|Buffer} 	content	Template as a string or buffer object.
 *  @param {Objet} 			dataObj 	The data as an object in key, value format.
 *  @param {Object} 			options 	*optional* - Default { prefix: "object" }.
 *  @param {Function} 		callback	*optional* - A callback finction to call.
 *  @returns {String|Buffer}
 */
exports.render = function render(content, dataObj, options, callback) {

	var textString = '', retBuffer = false;

	if(arguments.length === 3 && typeof arguments[2] === 'function') {
		callback = arguments[2];
		options = false;
	}

	options = getOptions(options);

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
