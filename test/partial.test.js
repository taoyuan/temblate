"use strict";

var Temblate = require('../');
var t = require('chai').assert;

describe('partial', function () {

    describe('include in template', function () {
        it('should render with handlebars partial', function () {
            var temblate = Temblate.create();
            temblate.configure('./fixtures/partial');
            temblate.registerHelpers('./fixtures/partial');
            var result = temblate.render('template', {name: 'ty', msg:'hello'});
            t.equal(result, 'hello ty');
        });
    });

    describe('include in helper', function () {
        it('should render with handlebars partial', function () {
            var temblate = Temblate.create();
            temblate.configure('./fixtures/partial');
            temblate.registerHelpers('./fixtures/partial');
            var result = temblate.render('custom', {name: 'ty', msg:'hello'});
            t.equal(result, 'hello ty');
        });
    });
});