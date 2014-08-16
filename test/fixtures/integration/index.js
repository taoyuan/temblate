"use strict";

var path = require('path');

exports.init = function (temblate) {
    temblate.registerPartial('echo', './partials/echo');
};