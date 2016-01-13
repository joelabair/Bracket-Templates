
/**
 *   Bracket Text templete renderer
 *
 *   Template Syntax:   [ [{prefix}-_.]{propertyName} : {default} ]
 */

var util = require('util');
var rxquote = require("regexp-quote");


var _defaults = {
	strictKeys: false,	// only mutate provided keys
	debug:	false,		// warning messages
	prefix:	""				// any string placeholder prefix (i.e. "object")
};

var _options = Object.create(_defaults);
_options = util._extend(_options, _defaults);

/*
 * Export the _options prototype forcing the object type on set.
 */
Object.defineProperty(module.exports, 'options', {
	enumerable: true,
	set: function(obj) {
		if (obj === null) {
			_options = Object.create(_defaults);
			_options = util._extend(_options, _defaults);
			return _options;
		}
		if (obj instanceof Array) {
			return _options;
		}
		return util._extend(_options, obj);
	},
	get: function() {
		return _options;
	}
});


/**
 *  key notation value extraction
 *
 *  @param {String} 	keyStr 			The key string, including sub-key notation (i.e. this.prop.key or thing-prop).
 *  @param {Object} 	dataObj 		The data object an array or object.
 *  @returns {Mixed}
 */
var _extract = function _extract(keyStr, dataObj) {
	var altkey,
		_subKey,
		_found = false,
		dataValue = null,
		keyNotation = keyStr.split(/[\-\_\.]/);

	if (dataObj && typeof dataObj === 'object') {
		dataValue = Object.create(dataObj)

		if (keyStr in dataValue) {
			dataValue = dataValue[keyStr];
			keyNotation.length = 0;
			_found = true;
		}

		while(keyNotation.length) {
			_subKey = keyNotation.shift();
			if (_subKey in dataValue) {
				dataValue = dataValue[_subKey];
				_found = true;
			} else {
				// bail on any level miss
				dataValue = null;
				keyNotation.length = 0;
				_found = false;
			}
		}

		if (!_found) {
			// alternate support for delimiters in place of spaces as a key
			altkey = keyStr.replace(/[\-\_\.]/,' ');
			if (altkey in dataObj) {
				dataValue = dataObj[altkey];
				_found = true;
			}
		}
	}

	return _found ? dataValue : NaN;
};


/**
 *  Text block renderer
 *
 *  @param {String} 	textString 	The template string.
 *  @param {Object} 	options 		The current options config.
 *  @param {Object} 	data 			The source keys and values as an object.
 *  @returns {String}
 */
var processBlocks = function processBlocks(textString, options, data) {

	var replacer = function replacer(match, $1, $2, $3, $4, $5, $6, offset, input) {
		var out = '',
			dataValue,
			type = String($2),
			key = String($3 || '').trim(),
			blockText = String($5),
			nestedBlocks;

		dataValue = _extract(key, data);

		if (options && typeof options === 'object' && options.strictKeys) {
			if(Number.isNaN(dataValue)) {
				return match;
			}
		}

		nestedBlocks = blockText.match(pattern);
		if (nestedBlocks) {
			blockText = blockText.replace(pattern, function(match, $1, $2, $3, $4, $5, $6, offset, input) {
				var index = match.indexOf($5);
				var length = $5.length;
				var body = $5.replace(/(?:\\*)\[(.+?)(?:\\*)\]/g, "\\[$1]");
				return match.substr(0, index) + body + match.substr(index + length);
			});
		}

		var obj = {}, proto = {}, KEY;
		if (typeof dataValue === 'object' && type === '#') {
			for(KEY in dataValue) {
				obj = {}, proto = {};
				proto.KEY = proto.INDEX = KEY;
				obj[KEY] = proto.VALUE = dataValue[KEY];
				obj.__proto__ = proto;
				if (typeof dataValue[KEY] === 'object' && !isNaN(parseInt(KEY))) {
					obj = dataValue[KEY];
					obj.__proto__ = proto;
				}
				out += renderData(blockText, options, obj, Boolean(options.prefix));
			}
			if (nestedBlocks) {
				out = processBlocks(out, options, data);
			}
		} else if (dataValue && (type === '~' || type === '#')) {
			// block logical truthy
			proto.KEY = proto.INDEX = key;
			proto.VALUE = Boolean(dataValue);
			obj = data;
			obj.__proto__ = proto;

			out += renderData(blockText, options, obj, Boolean(options.prefix));
			if (nestedBlocks) {
				out = processBlocks(out, options, data);
			}
		} else if (!dataValue && (type === '^' || type === '!')) {
			// block logical falsy
			proto.KEY = proto.INDEX = key;
			proto.VALUE = Boolean(dataValue);
			obj = data;
			obj.__proto__ = proto;

			out += renderData(blockText, options, obj, Boolean(options.prefix));
			if (nestedBlocks) {
				out = processBlocks(out, options, data);
			}
		}
		return out;
	};

	var pattern = new RegExp('(\\[\\s*(~|\\^|\\!|#)([^\\r\\n]+)\\s*\\])([\\s]?)([\\s\\S]*?)(\\[\\s*\\/\\3\\s*\\]\\4?)', 'mg');

	if(typeof data === 'object' && data !== null) {
		if (options && typeof options === 'object' && options.prefix) {
			pattern = new RegExp('(\\[\\s*(~|\\^|\\!|#)'+rxquote(String(options.prefix))+'[\\.\\-\\_]([^\\r\\n]+)\\s*\\])(\\s?)([\\s\\S]*?)(\\[\\s*\\/'+rxquote(String(options.prefix))+'[\\.\\-\\_]\\3\\s*\\]\\4?)', 'mg');
		}
		textString = textString.replace(pattern, replacer);
	}

	return textString;
};


/**
 *  Text tag renderer
 *
 *  @param {String} 	textString 	The template string.
 *  @param {Object} 	options 		The current options config.
 *  @param {Object} 	data 			The source keys and values as an object.
 *  @param {Bool}		doSpecials 	Optional - render plain special keys [KEY, INDEX, VALUE]
 *  @returns {String}
 */
var renderData = function renderData(textString, options, data, doSpecials) {

	var replacer = function replacer(match, $1, $2) {
		var extracted,
			dataValue,
			key = String($1 || '').trim(),
			defaultValue = String($2 || '').trim();

		// literal bracket excaping via \[ text ]
		if(match.substr(0, 1) === "\\") {
			return match.substr(1);
		}

		if (options && typeof options === 'object' && options.strictKeys) {
			extracted = _extract(key, data);
			dataValue = !Number.isNaN(extracted) ? extracted : match;
		} else {
			extracted = _extract(key, data);
			dataValue = !Number.isNaN(extracted) ? extracted : defaultValue;
		}
		if (defaultValue) {
			if (null === dataValue || typeof dataValue === 'object' || typeof dataValue === 'function' ) {
				dataValue = '';
			}
		}
		return String(dataValue) || String(defaultValue);
	};

	var pattern = new RegExp('\\\\?\\[(?:\\s*([\\w\\-\\.]+)\\s*)(?:\\:([^\\[\\]]+))?\\]', 'g');
	var spPattern = new RegExp('\\\\?\\[(?:\\s*(KEY|INDEX|VALUE)\\s*)(?:\\:([^\\[\\]]+))?\\]', 'g');

	if(typeof data === 'object'  && data !== null) {
		if (options && typeof options === 'object' && options.prefix) {
			pattern = new RegExp('\\\\?\\[(?:\\s*'+rxquote(String(options.prefix))+'[\\.\\-\\_]([\\w\\-\\.]+)\\s*)(?:\\:([^\\[\\]]+))?\\]', 'g');
		}
		if (doSpecials) {
			textString = textString.replace(spPattern, replacer);
		}
		textString = textString.replace(pattern, replacer);
	} else {
		throw new Error('No data to render!');
	}

	// clean any uncaught bracket-escape sequences
	return textString.replace(/(?:\\+)\[(.+)(?:\\+)\]/g, "[$1]").replace(/(?:\\+)\[(.+)(?:\\*)\]/g, "[$1]");
};


/**
 *  Return options inheriting form the module defaults.
 *
 *  @param {Object} 	options 	Custom options passed in.
 *  @returns {Object}
 */
var getOptions = function getOptions(opts) {
	var obj = Object.create(_options);
	obj = util._extend(obj, opts);
	return obj;
};


/**
 *  Render a square bracket text template.
 *
 *  @param {String|Buffer}		content	Template as a string or buffer object.
 *  @param {Objet} 				dataObj 	The data as an object in key, value format.
 *  @param {Object} 				options 	*optional* - Default { debug: fasle, prefix: "object" }.
 *  @param {Function} 			callback	*optional* - A callback finction to call.
 *  @returns {String|Buffer}
 */
exports.render = function render(content, dataObj, options, callback) {

	var textString = '', retBuffer = false, retString = false, err=null;

	if(arguments.length === 3 && typeof arguments[2] === 'function') {
		callback = arguments[2];
		options = false;
	}

	options = getOptions(options);

	if (typeof content === 'string') {
		retString = true;
	}

	if (Buffer.isBuffer(content)) {
		retBuffer = true;
	}

	if(retString || retBuffer) {
		textString = String(content);
		try {
			textString = processBlocks(textString, options, dataObj);
			textString = renderData(textString, options, dataObj);
		} catch (err) {
			if (options && typeof options === 'object' && options.debug) console.warn(err);
		}

		if (retBuffer) {
			// buffer in buffer out.
			textString = new Buffer(textString);
		}

		if(callback) {
			return callback(err, textString);
		}
		return textString;
	} else {
		err = new Error('No template to render!');
		if(callback) {
			return callback(err, null);
		}
		if (options && typeof options === 'object' && options.debug) console.warn(err);
		return null;
	}

};
