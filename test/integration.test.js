"use strict";

var path = require('path');

var Temblate = require('../');
var t = require('chai').assert;

describe('integration', function () {

    describe('partial', function () {
        it('should render with handlebars partial', function () {
            var temblate = Temblate.create();
            temblate.configure('./fixtures/integration');
            temblate.registerHelpers('./fixtures/integration');
            var result = temblate.render('template', {name: 'ty', msg:'hello'});
            t.equal(result, 'hello ty');
        });
    });
});