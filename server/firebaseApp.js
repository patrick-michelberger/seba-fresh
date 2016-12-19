import config from './config/environment';
var admin = require("firebase-admin");

var serviceAccount = require("./config/fresh-9a83f6531cd7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebase.databaseURL
});

export const auth = admin.auth();
export const database = admin.database();
