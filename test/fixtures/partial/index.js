"use strict";

var path = require('path');

exports.init = function (temblate) {
    temblate.registerPartial('echo', './partials/echo');

    temblate.registerHelper('echo', function () {
        return temblate.renderPartial('echo', this);
    });
};