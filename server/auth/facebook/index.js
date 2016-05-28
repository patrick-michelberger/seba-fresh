'use strict';

import express from 'express';
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

var router = express.Router();

router
    .get('/', passport.authenticate('facebook', {
        scope: ['public_profile'],
        failureRedirect: '/signup',
        session: false
    }))
    .get('/callback', passport.authenticate('facebook', {
        failureRedirect: '/signup',
        session: false
    }), setTokenCookie);

export default router;
