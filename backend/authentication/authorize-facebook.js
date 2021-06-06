const express = require("express");
const router = express.Router();
const passport = require("passport");
FacebookStrategy = require("passport-facebook").Strategy;
const db = require("./../server");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const { createToken, sendToken } = require("./../authentication/genrate-token");

const { CLIENT_ID_FB, CLIENT_SECRET_FB, CALL_BACK_URL_FB, FRONTEND_URL } =
  process.env;

passport.serializeUser((user, done) => {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: CLIENT_ID_FB,
      clientSecret: CLIENT_SECRET_FB,
      callbackURL: CALL_BACK_URL_FB,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        if (profile) {
          let user_email = profile._json.email;
          let sql = "SELECT * FROM users WHERE email = ? ";
          db.query(sql, user_email, (error, results, fields) => {
            if (error) return done(error);
            if (results.length !== 0) return done(null, profile);
            bcrypt.hash(profile._json.id, 8, async (err, hash) => {
              profile._json.id = hash;
              let user = {
                email: profile._json.email,
                password: profile._json.id,
                user_role: "user",
              };
              let sql = " INSERT INTO users SET ? ";
              db.query(sql, user_email, (error, results, fields) => {
                console.log("Success");
              });
            });
            done(null, profile);
          });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
// Facebook LoginRoute
router.get(
  "/authen/facebook",
  passport.authenticate("facebook", { scope: "email" })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/api/facebook/profile",
    failureRedirect: "/api/facebook/failed",
  })
);

router.get("/profile", (req, res) => {
  if(req.user._json === undefined) return
  const {FRONTEND_URL , TOKEN_FROM_FB} = process.env
  const {id , email } = req.user._json;
  let token = createToken(
    email,
    "user",
    TOKEN_FROM_FB
  );
  // console.log(req.user._json);
  sendToken(res,token);
  res.redirect(FRONTEND_URL +'/main')

});

router.get("/failed", (req, res) => {
  res.json({ status: 404, result: req.user });
});

module.exports = router;
