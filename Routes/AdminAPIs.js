import express, { Router } from "express";
const router = express.Router();
import dotenv from 'dotenv';
import { response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from "passport";
import GoogleAuth from 'passport-google-oauth2';
import { addNode } from '../Controllers/AdminController.js'
import AgentSchema from '../Models/AgentProfile.js'
import { trackPoints } from "../Controllers/AdminController.js";

var GoogleStrategy = GoogleAuth.Strategy;
passport.use(new GoogleStrategy({
    clientID: '803687131159-5cpq2kpje7mjf4101lfpqhk1fumbhc3j.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:5000/admin/google/callback",
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
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // console.log(req.user);
        // res.redirect('http://localhost:3000/');
        res.redirect('http://localhost:3000/');
    }
);

router.get('/auth/google',
    passport.authenticate('google', {
        scope: [
            'profile',
            'email'
        ]
    })
);

router.get('/getRequest', (req, res) => {
    console.log("dffffffffffffffffff");
    AgentSchema.find({}).then((results) => {
        res.json(results);
    }).catch((err) => {
        console.log(err);
    })
})

router.get('/login', (req, res) => {
    console.log(req.user);
    res.send(process.env.ADMINCLIENT_ID);
})
router.get('/noAccess', (req, res) => {
    res.send("You Lier");
})
router.patch('/acceptRequest/:id', (req, res) => {
    console.log(req.params);
    AgentSchema.updateOne({ _id: req.params.id }, { $set: { status: 1 } }).then((result) => {
        res.send({ Message: "SuccessFully Accepted" });
    }).catch((err) => {
        console.log(err);
        res.status(400);
    })
})
router.patch('/deleteRequest/:id', (req, res) => {
    console.log(req.params);
    AgentSchema.updateOne({ _id: req.params.id }, { $set: { status: 2 } }).then((result) => {
        res.send({ Message: "SuccessFully Deleted" });
    }).catch((err) => {
        console.log(err);
        res.status(400);
    })
})

router.post('/addmidpoint', addNode);
router.get('/trackpoints', trackPoints);
export default router;