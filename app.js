import dotenv from 'dotenv'

dotenv.config();
import express from 'express';
import web from "./routes/web.js"
import cors from "cors"
import mongoose from 'mongoose';
import connectDb from './config/connectdb.js';
import session from "express-session"
import passport from 'passport';
import { Strategy as QuickBooksStrategy } from 'passport-oauth2';
import Apiproxy from './controllers/ApiProxyController.js';
import Usercontroller from './controllers/homeController.js';




const app = express()

app.use(session({
  secret: 'your_secret_here',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new QuickBooksStrategy({
  clientID: process.env.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
  callbackURL: process.env.QUICKBOOKS_REDIRECT_URI,
  authorizationURL: 'https://appcenter.intuit.com/connect/oauth2',
  tokenURL: 'https://oauth.platform.intuit.com/oauth2/v1/tokens',
  scope: ['com.intuit.quickbooks.accounting'],
  environment: 'sandbox', 
  state: 'your_state_parameter_here'
},
  function (accessToken, refreshToken, profile, done) {
    // Save accessToken and refreshToken in database or session
    return done(null, { accessToken, refreshToken });
  }));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get('/login', passport.authenticate('oauth2'));

const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/", web)

// app.post('/register',Usercontroller.userRegistration)

// app.get("/decrypt",Apiproxy.ApiProxyController)

connectDb(DATABASE_URL)

app.listen(port, () => {
  // //api/user
  console.log(`Server listening at http://localhost:${port}`)
})