// import { response } from 'express';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import session from 'express-session';
import cors from 'cors';
import AdminRoutes from './Routes/AdminAPIs.js'
import GoogleAuth from 'passport-google-oauth2';
import ClientRoutes from './Routes/ClientAPIs.js'
import AgentRoutes from './Routes/AgentAPIs.js'

dotenv.config();
const app = express();

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})



app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true
    })
);


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGOOSEURL, { useNewUrlParser: true });


app.enable('trust proxy');
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/abcde', (req, res) => {
    console.log(req.user);
    res.send("abcd")
})




app.get('/', (req, res) => {
    console.log(req.user);
    res.send("ABCD");
});
app.use('/admin', AdminRoutes);
app.use('/client', ClientRoutes)
app.use('/agent', AgentRoutes);
app.get('/login', (req, res) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
        res.send("Cookies Saved");
    } else {
        res.send("Cookies not Saved ")
    }
})
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server Running at 5000" + process.env.PORT);
})