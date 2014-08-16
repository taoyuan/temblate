"use strict";

var Temblate = require('../');
var t = require('chai').assert;

describe('temblate', function () {

    it('should renderString work', function () {
        var temblate = Temblate.create();
        var result = temblate.renderString('{{name}}', {name: 'ty'});
        t.equal(result, 'ty');
    });

    it('should render with configure as some path', function () {
        var temblate = Temblate.create();
        temblate.configure('./fixtures/simple');
        var result = temblate.render('template', {name: 'ty', greeting:'hello'});
        t.equal(result, 'hello ty');
    });

    it('should render with configure as default', function () {
        var temblate = Temblate.create();
        temblate.configure(); // templatePath default is current path
        var result = temblate.render('./fixtures/simple/template', {name: 'ty', greeting:'hello'});
        t.equal(result, 'hello ty');
    });

    it('should render without configure', function () {
        var temblate = Temblate.create();
        var result = temblate.render('./fixtures/simple/template', {name: 'ty', greeting:'hello'});
        t.equal(result, 'hello ty');
    });
});