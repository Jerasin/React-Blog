const express = require("express");
const db = require("./../server");
const router = express.Router();
const mysql = require("mysql");

router.get("", (req, res) => {
  res.json({ message: "hello world!" });
  console.log("this is product");
});

module.exports = router;
