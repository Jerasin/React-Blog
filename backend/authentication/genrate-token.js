// Import Create Token
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const createToken = (email, user_role , short_id , provider) => {
  return jwt.sign(
    {
      email: email,
      userRole: user_role,
      short_id: short_id,
      from_provider: provider,
    },
    // process.env.JWT_SECRET
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.EXPIRESIN_TOKEN,
    }
  );
};

const sendToken = (res, token) => {
  res.cookie(process.env.COOKIE_NAME, token, { httpOnly: false });
};



module.exports =  {
  createToken,
  sendToken
}