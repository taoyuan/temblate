"use strict";

var utils = module.exports = {};

utils.safeString = function (str) {
    return new (require('handlebars')).SafeString(str);
};

utils.isPath = function (str) {
    return /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[\\\/])/.test(str);
};

utils.isHandlebarsSpecific = function(value) {
    return (value && (value.fn != null)) || (value && (value.hash != null));
};

utils.isUndefined = function(value) {
    return (value === void 0 || value === null) || utils.isHandlebarsSpecific(value);
};

utils.trim = function(str) {
    var trim;
    trim = /\S/.test("\xA0") ? /^[\s\xA0]+|[\s\xA0]+$/g : /^\s+|\s+$/g;
    return str.toString().replace(trim, '');
};

utils.isFunc = function(value) {
    return typeof value === 'function';
};

utils.isString = function(value) {
    return typeof value === 'string';
};

utils.result = function(value) {
    if (utils.isFunc(value)) {
        return value();
    } else {
        return value;
    }
};

utils['throw'] = function(err) {
    var error = err instanceof Error ? err : new Error(msg);
    throw new error;
};
