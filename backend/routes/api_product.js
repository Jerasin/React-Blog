const express = require("express");
const db = require("./../server");
const router = express.Router();
const mysql = require("mysql");

router.get("/", async (req, res, next) => {
  res.json("Hello")
});


module.exports = router;
