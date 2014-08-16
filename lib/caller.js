"use strict";

var path = require('path');
var callsites = require('callsites');

/**
 *
 * @param index
 * @returns {{filename: *, dirname: *}}
 */
module.exports = function (index) {
    if (arguments.length === 0) index = 0;
    var site = callsites()[index + 2];
    return {
        filename: site.getFileName(),
        dirname: path.dirname(site.getFileName())
    }
};