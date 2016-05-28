'use strict';

import express from 'express';
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

var router = express.Router();

router
    .get('/', passport.authenticate('paypal'))
    .get('/callback', passport.authenticate('paypal', {
        failureRedirect: '/signup'
    }), function(req, res) {
        res.redirect('/');
    });

export default router;
