const path = require("path");
const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");
const authorization = require("../authentication/authorize-jwt");

// ? Get Categories All
router.get("/", authorization, (req, res) => {
  const sql = "SELECT * FROM category";
  try {
    db.query(sql, (error, results, fields) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: results });
    });
  } catch (error) {
    return res.json({ status: 500, result: error });
  }
});

// ? Get Categories By limit
router.post("/categories", authorization, (req, res) => {
  const { pageSetting, limitSetting } = req.body;
  let startIndex = (pageSetting - 1) * limitSetting;
  let endIndex = limitSetting * pageSetting;
  const sql =
    "SELECT c.id , c.created_at , c.language , u.email FROM category as c LEFT JOIN  users as u ON c.created_by = u.short_id ;";
  try {
    db.query(sql, (error, fields, files) => {
      if (error) {
        return res.json({ status: 404, result: error });
      }

      const dataLenth = fields.length;

      const countPage = () => {
        return parseInt(Math.ceil(dataLenth / limitSetting));
      };

      const results = fields.splice(startIndex, endIndex);

      const next = () => {
        return parseInt(pageSetting) + 1;
      };

      const now = () => {
        return parseInt(pageSetting);
      };

      const after = () => {
        return parseInt(pageSetting) - 1;
      };

      return res.json({
        status: 200,
        result: results,
        after: after(),
        now: now(),
        next: next(),
        countPage: countPage(),
      });
    });
  } catch (err) {
    return res.status(500).json({ status: 200, result: result });
  }
});

// ? Create Category
router.post("/", authorization, (req, res) => {
  const sql = " INSERT INTO category SET ? ";
  const { language, created_by } = req.body;
  console.log(req.body);
  const data = {
    language: language,
    created_by: created_by,
  };
  try {
    db.query(sql, data, (error, results, fields) => {
      if (error) console.error(error);
      return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields });
    });
  } catch (err) {
    return res.status(500).json({ status: 500, result: err });
  }
});

// ? Delete Category
router.delete("/:id", authorization ,(req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = "DELETE FROM category WHERE id = ?";
  try {
    db.query(sql, id, (error, results, fields) => {
      if (error) console.log(error);
      return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: results });
    });
  } catch (err) {
    return res.status(500).json({ status: 500, result: err });
  }
});

// ? Get Category By Id
router.post(`/:id` , authorization , (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql =
    "SELECT c.id , c.language , c.created_at , c.created_by , c.updated_by , c.updated_at , u.email FROM category as c LEFT JOIN  users as u ON c.created_by = u.short_id WHERE c.id = ? ";

  let testsql = mysql.format(sql, id);
  console.log(testsql);
  try {
    db.query(sql, id, (error, results, fields) => {
      if (error) return res.json({ status: 404, result: error });
      console.log(results);
      return res.json({ status: 200, result: results });
    });
  } catch (err) {
    return res.status(500).json({ status: 500, result: err });
  }
});

//? Updates Category
router.put(`/:id` , authorization , (req, res) => {
  const { id } = req.params;
  const { language, forceUpdate_by } = req.body;
  const data = {
    language: language,
    updated_at: new Date(),
    updated_by: forceUpdate_by,
  };

  const sql = "UPDATE category SET ? WHERE id = ?  ";

  let testsql = mysql.format(sql, [data, id]);
  console.log(testsql);
  try {
    db.query(sql, [data, id], (error, fields, files) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields });
    });
  } catch (error) {
    return res.json({ status: 500, result: error });
  }
});

module.exports = router;
