const express = require("express");
const router = express.Router();
const passport = require("passport");
FacebookStrategy = require("passport-facebook").Strategy;

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.CLIENT_ID_FB,
//       clientSecret: process.env.CLIENT_SECRET_FB,
//       callbackURL: "http://localhost:4000/authen/facebook/secrets",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//         if (err) {
//           return done(err);
//         }
//         done(null, user);
//       });
//     }
//   )
// );

router.get("/", (req, res) => {
  res.json("please login");
});
// app.get("/auth/facebook", passport.authenticate("facebook"));
// app.get(
//   "/auth/facebook/secrets",
//   passport.authenticate("facebook", {
//     successRedirect: "/profile",
//     failureRedirect: "/",
//   })
// );
// app.get("/profile", (req, res) => {
//   console.log(req.user);
//   res.json(req.user);
// });

module.exports = router;
