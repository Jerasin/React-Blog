const express = require("express");
const db = require("./../server");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const { createToken } = require("../authentication/genrate-token");
const {autoGen_shortID} = require("../authentication/short-running");

router.post("/test", (req, res) => {
  console.log(req.body);
  res.json({ status: 200, result: req.body });
});

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
        console.log(result);
      });
    });
  }
});

// Register and Login FB
router.post("/register_fb", (req, res) => {
  try {
    const { email, password, user_role } = req.body;

    let user = {
      email: email,
      password: password,
      user_role: user_role,
      short_id: autoGen_shortID(),
    };
    let sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, user.email, (error, results, fields) => {
      if (error)
        return res.json({
          status: 404,
          message: error, // error.sqlMessage
        });
      if (results.length > 0) {
        const { email, user_role } = results[0];
        let token = createToken(email, user_role, "Facebook");
        return res.json({
          status: 200,
          result: token,
        });
      }

      bcrypt.hash(user.password, 8, (err, hash) => {
        user.password = hash;
        let sql = " INSERT INTO users SET ? ";
        db.query(sql, user, (error, results, fields) => {
          // เกิด error ในคำสั่ง sql
          if (error)
            return res.json({
              status: 404,
              message: "Internal Server Error", // error.sqlMessage
            });
          // แสดงข้อมูลกร๊ไม่เกิด error
          const result = {
            status: 200,
            data: results,
          };
          let token = createToken(user.email, user.user_role, "Facebook");
          res.json({
            status: 200,
            result: token,
          });
        });
      });
    });
  } catch (err) {
    res.json({ status: 500, result: err });
  }
});

// Register
router.post("/register", (req, res, next) => {
  try {
    const { email, password, user_role } = req.body;
    // Check Pattrn Email
    let regularEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
    if (regularEmail.test(email) === false)
      return res.json({
        status: 404,
        result: "Please Check Email",
      });
    // Check Duplicate Email

    let sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, email, (error, results, fields) => {
      if (error)
        return res.json({
          status: 404,
          message: error, // error.sqlMessage
        });
      if (results.length > 0) 
      return res.json({
        status: 404,
        result: "Email Duplicate",
      });

      let user = {
        email: email,
        password: password,
        user_role: user_role,
        short_id: runningShortId(),
      };
      bcrypt.hash(user.password, 8, (err, hash) => {
        user.password = hash;
        let sql = " INSERT INTO users SET ? ";
        db.query(sql, user, (error, results, fields) => {
          // เกิด error ในคำสั่ง sql
          if (error)
            return res.json({
              status: 404,
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
  
  } catch (err) {
    res.json({ status: 500, result: err });
  }

});

// Get All User
router.get("/users", (req, res, next) => {
  try {
    const { user } = req.body;
    let sql = " SELECT * FROM users ";
    db.query(sql, user, (error, results, fields) => {
      // เกิด error ในคำสั่ง sql
      if (error)
        return res.status(500).json({
          status: 404,
          message: "Internal Server Error", // error.sqlMessage
        });
      // แสดงข้อมูลกร๊ไม่เกิด error
      const result = {
        status: 200,
        data: results,
      };
      res.json(result);
    });
  } catch (err) {
    res.json({
      status: 500,
      result: err,
    });
  }
});

// Select By Id
router.route("/user/:id").get((req, res, next) => {
  try {
    const { id } = req.params;
    // ทำการแสดงข้อมูลทั้งหมด
    let sql = " SELECT * FROM users WHERE id = ? ";
    db.query(sql, id, (error, results, fields) => {
      // เกิด error ในคำสั่ง sql
      if (error)
        return res.status(500).json({
          status: 404,
          message: "Internal Server Error", // error.sqlMessage
        });
      // แสดงข้อมูลกร๊ไม่เกิด error
      const result = {
        status: 200,
        data: results,
      };
      return res.json(result);
    });
  } catch (err) {
    res.json({
      status: 500,
      result: err,
    });
  }
});

// Login
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    let sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, email, (error, results, fields) => {
      if (error)
        return res.status(500).json({
          status: 404,
          message: "Internal Server Error", // error.sqlMessage
        });

      // ไม่มี Email ใน db
      if (results.length === 0) {
        return res.json({
          status: 404,
          result: "Not Found",
        });
      }
      // Decode Hash password
      let result = bcrypt.compareSync(password, results[0].password);

      let token = createToken(results[0].email, results[0].user_role, "System");

      // มี Email และ Password ใน db
      if (result === true) {
        return res.json({
          status: 200,
          result: token,
        });
      }

      // ไม่มี Password ใน db
      return res.json({
        status: 404,
        result: "Not Found",
      });
    });
  } catch (err) {
    res.json({
      status: 505,
      result: err,
    });
  }
});

module.exports = router;
