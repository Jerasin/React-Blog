const path = require("path");
const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");
const authorization = require("../authentication/authorize-jwt");

router.get("/", (req, res) => {
  let sql = "SELECT * FROM category";
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ status: 404, result: err });
    }

    res.json({ status: 200, result: result });
  });
});

module.exports = router;
