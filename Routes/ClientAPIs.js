import express, { Router } from "express";
const router = express.Router();
import dotenv from 'dotenv';
import { response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { GetPath, createDelivery } from "../Controllers/ClientController.js";
import passport from "passport";
import GoogleAuth from 'passport-google-oauth2';
import { History } from "../Controllers/ClientController.js";

var GoogleStrategy = GoogleAuth.Strategy;
passport.use('client', new GoogleStrategy({
    clientID: process.env.CLIENT_GOOGLE_ID,
    clientSecret: process.env.CLIENT_GOOGLE_SECRET,
    callbackURL: "http://localhost:5000/client/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        /*if (profile && profile._json && profile._json.email && profile._json.email == 'jeetakminder@gmail.com')
            return done(null, profile);
        else return done(null);*/
        done(null, profile);

    }
));

router.get('/google/callback',
    passport.authenticate('client', { failureRedirect: '/login' }),
    function (req, res) {
        // console.log(req.user);
        // res.redirect('http://localhost:3000/');
        res.redirect('http://localhost:3000/client/history');
    }
);

router.get('/auth/google',
    passport.authenticate('client', {
        scope: [
            'profile',
            'email'
        ]
    })
);

router.get('/history', History);
router.post('/createDelivery', createDelivery);
router.post('/getpath', GetPath);

export default router