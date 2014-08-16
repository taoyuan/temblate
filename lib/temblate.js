"use strict";

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var reso = require('reso');

var utils = require('./utils');
var caller = require('./caller');

module.exports = Temblate;

function Temblate(opts) {
    if (!(this instanceof Temblate)) return new Temblate(opts);

    opts = opts || {};

    var Handlebars;
    if (opts.compile && opts.registerHelper) {
        Handlebars = opts;
        opts = {};
    }
    this.initialOpts = opts;
    this.Handlebars = Handlebars || opts.Handlebars || opts.handlebars || opts.hbs || require('handlebars').create();
    this.templates = {};

    require('handlebars-helpers').register(this.Handlebars, {});
    require('./helpers').register(this);
}

Object.defineProperty(Temblate.prototype, 'partials', {
    get: function () { return this.Handlebars.partials; },
    set: function (v) { this.Handlebars.partials = v; }
});

Temblate.prototype.configure = function (templatesPath, opts) {
    if (typeof templatesPath === 'object') {
        opts = templatesPath;
        templatesPath = null;
    }
    opts = opts || {};

    if (!templatesPath) {
        templatesPath = caller().dirname;
    } else if (utils.isPath(templatesPath)) {
        templatesPath = path.resolve(caller().dirname, templatesPath);
    }

    this.loader = reso.create(_.assign({
        basedir: templatesPath,
        extensions: ['.hbs', '.handlebars']
    }, opts));
};

Temblate.prototype._checkConfigure = function () {
    if (!this.loader) this.configure(caller(1).dirname);
};

Temblate.prototype.registerHelper = function (name, fn) {
    return this.Handlebars.registerHelper(name, fn);
};

Temblate.prototype.registerHelpers = function (helpers) {
    if (typeof helpers === 'string') {
        var res = reso.create().site().resolve(helpers);
        var mod = require(res);
        var register = mod.init || mod.register;
        if (!register) throw new Error('`' + helpers + '` has no `init(temblate)` or `register(temblate)` function');
        return register(this);
    }

    for (var name in helpers) if (helpers.hasOwnProperty(name)) {
        if (typeof helpers[name] === 'function') {
            this.registerHelper(name, helpers[name]);
        }
    }
};

Temblate.prototype.getTemplate = function (name) {
    var fullpath = this.loader.resolve(utils.isPath(name) ? name : './' + name);
    if (this.templates[fullpath]) return this.templates[fullpath];
    return this.templates[fullpath] = this.compile(fs.readFileSync(fullpath, 'utf-8'));
};

Temblate.prototype.compile = function (input, options) {
    return this.Handlebars.compile(input, options);
};

Temblate.prototype.registerPartial = function (name, file) {
    var res = reso.create({extensions: ['.hbs', '.handlebars']}).site().load(file);
    var partial = this.compile(res.content);
    this.Handlebars.registerPartial(name, partial);
};

Temblate.prototype.renderString = function (source, context, options) {
    this._checkConfigure();
    return this.compile(source)(context, options);
};

Temblate.prototype.render = function (name, context) {
    this._checkConfigure();
    return this.getTemplate(name)(context);
};

Temblate.prototype.renderPartial = function (name, context) {
    this._checkConfigure();
    if (!this.partials[name]) throw new Error('Unknown partial `' + name + '`');
    return this.partials[name](context);
};

Temblate.create = function (opts) {
    return new Temblate(opts);
};

Temblate.utils = require('./utils');