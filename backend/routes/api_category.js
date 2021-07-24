const path = require("path");
const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");
const authorization = require("../authentication/authorize-jwt");

router.get("/", (req, res) => {
  const sql = "SELECT c.id , c.created_at , c.language , u.email FROM category as c LEFT JOIN  users as u ON c.created_by = u.short_id ;";
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ status: 404, result: err });
    }

    res.json({ status: 200, result: result });
  });
});

router.post("/", (req, res) => {
  const sql = " INSERT INTO category SET ? ";
  const { language , created_by } = req.body;
  console.log(req.body);
  const data = {
    language: language,
    created_by: created_by,
  };
  try {
    db.query(sql, data, (error, results, fields) => {
      if (error) 
      console.error(error);
      return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields });
    });
  } catch (err) {
    return res.status(500).json({ status: 500, result: err });
  }
});

module.exports = router;
