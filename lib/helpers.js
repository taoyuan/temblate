"use strict";

var utils = require('./utils');

function itemify(value) {
    var item = value;
    if (typeof value === 'string') {
        item = {
            value: value
        }
    }
    return item;
}

var helpers = {
    q: function (value) {
        return utils.safeString(JSON.stringify(value, null, 2));
    },

    default: function (value, defaultValue) {
        return value != null ? value : defaultValue;
    },

    /**
     * http://handlebarsjs.com/block_helpers.html
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    noop: function (options) {
        return options.fn(this);
    },

    /**
     * {{#withHash}}
     * Build context from the attributes hash
     * @author Vladimir Kuznetsov <https://github.com/mistakster>
     */
    withHash: function (options) {
        return options.fn(options.hash || {});
    },

    replace: function (str, cond, replacement, options) {
        if (typeof str !== 'string') return str;
        var match = cond.match(/^\/(.*?)\/([gim]*)$/);
        var regexp = match ? new RegExp(match[1], match[2]) : new RegExp(cond);
        return utils.safeString(str.replace(regexp, replacement));
    },

    // Object and Arrays
    forEach: function (context, options) {
        var total, i, item;
        var content = "";

        if (context) {
            if (typeof context.length === 'number' && typeof context !== 'string') {
                total = context.length;
                // Better performance: http://jsperf.com/for-vs-forEach/2
                i = 0;
                while (i < total) {
                    // stick an index property onto the item, starting
                    // with 1, may make configurable later
                    item = itemify(context[i]);
                    item['index'] = i + 1;
                    item['_total'] = total;
                    item['isFirst'] = i === 0;
                    item['isLast'] = i === (total - 1);
                    // show the inside of the block
                    content += options.fn(item);
                    i++;
                }
            } else {
                var keys = Object.keys(context);
                total = keys.length;
                i = 0;
                while (i < total) {
                    // stick an index property onto the item, starting
                    // with 1, may make configurable later
                    var key = itemify(keys[i]);
                    item = context[key];
                    item['key'] = key;
                    item['isFirst'] = i === 0;
                    item['isLast'] = i === (total - 1);
                    // show the inside of the block
                    content += options.fn(item);
                    i++;
                }
            }
        }

        return content;
    }
};

// Export helpers
module.exports.register = function (temblate) {
    temblate.registerHelpers(helpers);
};