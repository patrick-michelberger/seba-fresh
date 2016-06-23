"use strict";

var config = require('../../config/environment');
var templates = require('../templates');

// TODO: use amazon
var nodemailer = require('nodemailer');
//var sesTransport = require('nodemailer-ses-transport'); // needed for Amazon AWS

var opts = {
  service: config.mail.service,
  auth: {
    user: config.mail.username,
    pass: config.mail.password
  }
};

var transport = nodemailer.createTransport(opts);

var mailer = {};

mailer.send = function (data, callback) {
  // From
  var from = data.from || 'sebafresh.grocery@gmail.com';

  console.log("sending email...");

  // To
  var to = '';
  if (data.user && data.user.email) to = data.user.email;
  if (data.to) to = data.to;
  if (!to) return callback(new Error('Send mail: Need data.to'));

  // Subject
  var subject = data.subject;
  if (!subject) return callback(new Error('Send mail: Need data.subject'));

  // Language
  var language = 'en'; // default
  if (data.user && data.user.language) language = data.user.language;
  if (data.language) language = data.language;
  // Set language for handlebars
  data.language = language;

  // Template
  if (!data.template) return callback(new Error('Send mail: Need data.template'));
  var template = templates[data.template];
  if (!template) return callback(new Error('Send mail: Template ' + data.template + ' not found'));
  // HTML
  var html = template(data);
  if (!html) return callback(new Error('Send mail: Could not render ' + data.template));

  transport.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  }, function (err) {
    if (err) {
      console.log('Send mail:', err);
      return callback(err);
    }
    console.log("email sentt");
    callback();
  });
};

module.exports = mailer;
