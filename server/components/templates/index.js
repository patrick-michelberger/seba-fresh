"use strict";

var fs = require('fs');
var Handlebars = require('handlebars');

var gt = require('../gettext');

Handlebars.registerHelper('translate', function (msgid) {
  console.log('Handlebars:', this);
  return gt.dgettext(this.language, msgid);
});

var readtemplatesSync = function (path) {
  console.log('Loading templates...');
  var views = fs.readdirSync(path);
  var templates = {};

  console.log('Compiling templates...');
  views.forEach(function (view) {
    var template = fs.readFileSync(path + '/' + view, 'utf8');
    templates[view] = Handlebars.compile(template);
  });
  console.log('Done adding templates.');
  return templates;
};

var templates = readtemplatesSync('./server/views');
console.log('Templates:', Object.getOwnPropertyNames(templates));

module.exports = templates;
