const express = require("express");
const port = 4000;
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const passport = require("passport");
const session = require("express-session")


app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/upload"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());
/////////// Open  Code Connect DB //////////////////////
const dbConfig = require("./config/config");

console.log(dbConfig);
const db = mysql.createConnection(dbConfig);

db.connect((err, database) => {
  if (err) return console.log(err);
  console.log("Database is Running");
  /////////// Open Code Route //////////////////////
  const user_api = require("./routes/api_user");
  app.use("/api/authen", user_api);
  const product_api = require("./routes/api_product");
  app.use("/api/product", product_api);
  const facebook_api = require("./authentication/authorize-facebook");
  app.use("/api/facebook", facebook_api);
  const google_api = require("./authentication/authorize-google");
  app.use("/api/google", google_api);
  /////////// Close Code Route //////////////////////

  app.listen(port, () => {
    console.log("Server Running Port" + " " + port);
  });
});

/////////// Close Code Connect DB //////////////////////

module.exports = db;
