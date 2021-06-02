const express = require("express");
const db = require("./../server");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

router.get('/',(req,res)=>{
  res.json("Running")
})

router.post("/fakedata", async (req, res, next) => {
  for (let index = 1; index <= 1000; index++) {
    let user = {
      email: "Test" + index + "gmail.com",
      password: String(Math.random() * 1000000),
      user_role: "user",
      create_by: "admin",
    };
    bcrypt.hash(user.password, 8, async (err, hash) => {
      user.password = hash;
      let sql = " INSERT INTO users SET ? ";
      await db.query(sql, user, (error, results, fields) => {
        // เกิด error ในคำสั่ง sql
        if (error) console.log(error);
        const result = {
          status: 200,
          data: results,
        };
        console.log(index);
      });
    });
  }
});

// Register
router.post("/register", (req, res, next) => {
  let user = req.body;
  // Check Pattrn Email
  let regularEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
  if (regularEmail.test(user.email) === false)
    return res.status(404).json({
      status: 404,
      result: "Please Check Email",
    });
  // Check Duplicate Email

  let sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, user.email, (error, results, fields) => {
    if (error)
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error", // error.sqlMessage
      });
    if (results.length > 0)
      return res.json({
        status: 404,
        result: "Email Duplicate",
      });
 
    bcrypt.hash(user.password, 8, (err, hash) => {
      user.password = hash;
      let sql = " INSERT INTO users SET ? ";
      db.query(sql, user, (error, results, fields) => {
        // เกิด error ในคำสั่ง sql
        if (error)
          return res.status(500).json({
            status: 500,
            message: "Internal Server Error", // error.sqlMessage
          });
        // แสดงข้อมูลกร๊ไม่เกิด error
        const result = {
          status: 200,
          data: results,
        };
        return res.json(result);
      });
    });
 
  });
});

router.get("/users", (req, res, next) => {
  // ทำการแสดงข้อมูลทั้งหมด
  const { user } = req.body;
  let sql = " SELECT * FROM users ";
  db.query(sql, user, (error, results, fields) => {
    // เกิด error ในคำสั่ง sql
    if (error)
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error", // error.sqlMessage
      });
    // แสดงข้อมูลกร๊ไม่เกิด error
    const result = {
      status: 200,
      data: results,
    };
    res.json(result);
  });
});
// Select By Id
router.route("/user/:id").get((req, res, next) => {
  const { id } = req.params;
  // ทำการแสดงข้อมูลทั้งหมด
  let sql = " SELECT * FROM users WHERE id = ? ";
  db.query(sql, id, (error, results, fields) => {
    // เกิด error ในคำสั่ง sql
    if (error)
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error", // error.sqlMessage
      });
    // แสดงข้อมูลกร๊ไม่เกิด error
    const result = {
      status: 200,
      data: results,
    };
    return res.json(result);
  });
});

// Login
router.post("/login", (req, res) => {
  const { email } = req.body;
  let sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, email, (error, results, fields) => {
    if (error)
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error", // error.sqlMessage
      });
    console.log(results);
    if (results.length > 0) return console.log(true);
    return console.log(false);
  });
});

module.exports = router;
