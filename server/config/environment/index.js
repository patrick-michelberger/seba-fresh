'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  domain: process.env.DOMAIN,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'seba-fresh-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  mail: {
    username: process.env.MAIL_USERNAME || 'username',
    password: process.env.MAIL_PASSWORD || 'password',
    service: process.env.MAIL_SERVICE || 'service'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  paypal: {
    clientId: process.env.PAYPAL_APP_ID ||  'id',
    clientSecret: process.env.PAYPAL_APP_SECRET ||  'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/paypal/callback'
  },

  walmart: {
    key: process.env.WALMART_API_KEY || 'id'
  },

  aws: {
    accessKey: process.env.AWS_ACCESS_KEY ||  'key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ||  'secret',
    region: process.env.AWS_REGION ||  'region'
  },

  firebase: {
    apiKey: process.env.FIREBASE_API_KEY ||  'key',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN ||  'authDomain',
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'databaseUrl',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'storageBucket',
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});
