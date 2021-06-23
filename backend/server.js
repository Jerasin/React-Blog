const express = require("./config/express");
const app = express();

const mysql = require("mysql");
const passport = require("passport");
const session = require("express-session");

app.use(session({ secret: "anything" }));
app.use(passport.initialize());
app.use(passport.session());

//  Open  Code Connect DB
const dbConfig = require("./config/config");

console.log(dbConfig);
const db = mysql.createConnection(dbConfig);

db.connect((err, database) => {
  const express = require("./config/express");
  const port = process.env.PORT;
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const app = express();

  if (err) return console.log(err);
  console.log("Database is Running");
  // Open Code Route
  const user_api = require("./routes/api_user");
  app.use("/api/authen", user_api);

  const post_api = require("./routes/api_post");
  app.use("/api/post", post_api);

  const texteditor_post_api = require("./routes/api_post_texteditor");
  app.use("/api/post-texteditor", texteditor_post_api);

  const category_api = require("./routes/api_category");
  app.use("/api/category", category_api);

  const facebook_api = require("./authentication/authorize-facebook");
  app.use("/api/facebook", facebook_api);

  const google_api = require("./authentication/authorize-google");
  app.use("/api/google", google_api);
  //  Close Code Route

  app.listen(port, () => {
    console.log("Server Running Port:" + " " + port + " , " + "Environment:" + " " +process.env.NODE_ENV);
  });
});

/////////// Close Code Connect DB //////////////////////

module.exports = db;
