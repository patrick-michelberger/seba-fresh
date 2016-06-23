"use strict";

var fs = require('fs');

var Gettext = require("node-gettext");
var gt = new Gettext();

var readlanguagesSync = function (path) {
  console.log('Loading language files...');
  var languages = fs.readdirSync(path);

  languages.forEach(function (language) {
    var filename = language.split('.');
    var domain = filename[0];
    var filetype = filename[1];

    if (filetype === 'po') {
      var file = fs.readFileSync(path + '/' + language, 'utf8');
      gt.addTextdomain(domain, file);
    }
  });
  console.log('Done adding language files.');
};

var languages = readlanguagesSync('./server/i18n');
// set default language
gt.textdomain('en');

console.log('gettext:', gt);
module.exports = gt;
