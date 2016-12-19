"use strict";

var config = require('../../config/environment');
var templates = require('../templates');
var ses = require('nodemailer-ses-transport');

// TODO: use amazon
var nodemailer = require('nodemailer');
//var sesTransport = require('nodemailer-ses-transport'); // needed for Amazon AWS

console.log("config.aws: ", config.aws);

var transport = nodemailer.createTransport(ses({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
}));

var mailer = {};


/**
 * Send email to a receipient
 * {Object} data
 * {String} data.to - receipient email e.g. pmichelberger@gmail.component
 * {String} data.template - name of the email HTML template. Has to be .hbs file and placed in server/views/ e.g. invite.hbs
 * {String} data.subject - subject of the email
 * {Object} data.payload - data included in template file
 */
mailer.send = function(data, callback) {
  // From
  var from = 'invitation@project-fresh.com';

  console.log("sending email...");

  // To
  var to = '';
  if (data.user && data.user.email) to = data.user.email;
  if (data.to) to = data.to;
  if (!to) return callback(new Error('Send mail: Need data.to'));

  // Subject
  var subject = data.subject;
  if (!subject) return callback(new Error('Send mail: Need data.subject'));
  if (data.payload) {
    data.payload.subject = data.subject;
  }

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
  var html = template(data.payload);
  if (!html) return callback(new Error('Send mail: Could not render ' + data.template));
  var payload = {
    from: from,
    to: to,
    subject: subject,
    html: html
  };
  transport.sendMail(payload,
    function(err, result) {
      if (err) {
        console.log('Send mail:', err);
        return callback(err);
      }
      console.log("email sent: ", result);
      callback();
    });
};

module.exports = mailer;
