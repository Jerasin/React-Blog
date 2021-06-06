const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./../server");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const {createToken , sendToken} = require("./genrate-token")

const { CLIENT_ID_GOOGLE, CLIENT_SECRET_GOOGLE, CALL_BACK_URL_GOOGLE } =
  process.env;

passport.serializeUser((user, done) => {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID_GOOGLE,
      clientSecret: CLIENT_SECRET_GOOGLE,
      callbackURL: CALL_BACK_URL_GOOGLE,
    },
    (accessToken, refreshToken, profile, done) => {
      let user_email = profile._json.email;
      let sql = "SELECT * FROM users WHERE email = ? ";
      db.query(sql, user_email, (error, results, fields) => {
        if (error) return done(error);
        if (results.length !== 0) return done(null, profile);
        bcrypt.hash(profile._json.sub, 8, (err, hash) => {
          profile._json.sub = hash;
          console.log(profile._json.sub);
          let user = {
            email: profile._json.email,
            password: profile._json.sub,
            user_role: "user",
          };

          let sql = " INSERT INTO users SET ? ";
          db.query(sql, user, (error, results, fields) => {
            console.log(results);
          });
        });

        done(null, profile);
      });
    }
  )
);

// Google LoginRoute
router.get(
  "/authen/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "/api/google/profile",
    failureRedirect: "/api/google/failed",
  }),
);

router.get('/profile',(req,res)=>{
  const {FRONTEND_URL , USER_ROLE , TOKEN_FROM_GO} = process.env
  const {email} = req.user._json
  let token = createToken(email, USER_ROLE , TOKEN_FROM_GO)
  sendToken(res,token)
  res.redirect(FRONTEND_URL  +'/main')
})

router.get('/failed',(req,res)=>{
  res.json({status: 404 , result: "Erorr Connect"})
})

module.exports = router;
