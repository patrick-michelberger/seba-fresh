import config from './config/environment';
import * as firebase from 'firebase';

firebase.initializeApp(config.firebase);
export const auth = firebase.auth();
export const database = firebase.database();
