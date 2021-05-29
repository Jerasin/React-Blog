const express = require("express");
const port = 4000;
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/upload"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

/////////// Open  Code Connect DB //////////////////////
const dbConfig = require("./config/config");
console.log(dbConfig);
const db = mysql.createConnection(dbConfig);

db.connect((err, database) => {
  if (err) return console.log(err);
  console.log("Database is Running");
  const user_api = require("./routes/api_user");

  app.use("/api/authen", user_api);

  app.listen(port, () => {
    console.log("Server Running Port" + " " + port);
  });
});

/////////// Close Code Connect DB //////////////////////

module.exports = db;
