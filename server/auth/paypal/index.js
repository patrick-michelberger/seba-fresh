'use strict';

import express from 'express';
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

var router = express.Router();

router
    .get('/', passport.authenticate('paypal', {
      "scope": ['email', 'openid', 'profile']
    }))
    .get('/callback', passport.authenticate('paypal', {
        failureRedirect: '/signup',
        session: false
    }), setTokenCookie);

export default router;
