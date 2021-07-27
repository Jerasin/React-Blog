const express = require("express");
const db = require("./../server");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const { createToken } = require("../authentication/genrate-token");
const {
  autoGen_shortID,
  add_shortID,
} = require("../authentication/short-running");
const authorization = require("../authentication/authorize-jwt");

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
    console.log(req.body);
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
        short_id: autoGen_shortID(),
      };
      bcrypt.hash(user.password, 8, (err, hash) => {
        user.password = hash;
        const sql_insert = " INSERT INTO users SET ? ";
        db.query(sql_insert, user, (error, results, fields) => {
          // เกิด error ในคำสั่ง sql
          if (error)
            return res.json({
              status: 404,
              message: error, // error.sqlMessage
            });
          // แสดงข้อมูลกร๊ไม่เกิด error
          const result = {
            status: 200,
            data: results,
          };
          add_shortID();
          return res.json(result);
        });
      });
    });
  } catch (err) {
    res.json({ status: 500, result: err });
  }
});

// Get All User
router.get("/users", authorization, (req, res, next) => {
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
router.get("/user/:id", authorization, (req, res, next) => {
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
  console.log(req.body);
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

      let token = createToken(
        results[0].email,
        results[0].user_role,
        results[0].short_id,
        "System"
      );

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

// ? Get Users By limit
router.post("/users", authorization, (req, res) => {
  const { pageUser, limitUser } = req.body;
  let startIndex = (pageUser - 1) * limitUser;
  let endIndex = limitUser * pageUser;
  const sql =
    "SELECT u.id , u.short_id , u.email , a.role_name  , u.created_at , u.updated_at , u.updated_by FROM master_blog.users as u LEFT JOIN authen as a ON  u.user_role = a.id;";
  try {
    db.query(sql, (error, fields, files) => {
      if (error) {
        return res.json({ status: 404, result: error });
      }

      const dataLenth = fields.length;

      const countPage = () => {
        return parseInt(Math.ceil(dataLenth / limitUser));
      };

      const results = fields.splice(startIndex, endIndex);

      const next = () => {
        return parseInt(pageUser) + 1;
      };

      const now = () => {
        return parseInt(pageUser);
      };

      const after = () => {
        return parseInt(pageUser) - 1;
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

// ? Delete Category
router.delete("/user/:id", authorization, (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = "DELETE FROM users WHERE id = ?";
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

// ? Get Role All
router.get("/roles", authorization, (req, res) => {
  const sql = ` SELECT * FROM authen;`;
  try {
    db.query(sql, (error, results, fields) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: results });
    });
  } catch (error) {
    return res.json({ status: 500, result: err });
  }
});

// ? Get User By Id
router.post(`/user/:id`, authorization, (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = `SELECT u.id , u.short_id , u.email , a.role_name  , u.created_at , u.updated_at , u.updated_by
    FROM users as u
    LEFT JOIN authen as a
    ON  u.user_role = a.id
    WHERE u.id = ? `;

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

// ? Update user
router.put(`/user/:id`, authorization, (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const { email, role, updated_by, updated_at, role_id, forceUpdate_by } =
    req.body;
  const data = {
    email: email,
    user_role: role_id,
    updated_by: forceUpdate_by,
    updated_at: new Date(),
  };

  const sql = "UPDATE users SET ? WHERE id = ?  ";
  try {
    db.query(sql, [data, id], (error, fields, files) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields });
    });
  } catch (err) {
    return res.json({ status: 500, result: err });
  }
});

router.post(`/user-role`, authorization, (req, res) => {
  // console.log(req.body);

  const { role, created_by } = req.body;
  const data = {
    role_name: role,
    created_by: created_by,
  };

  const sql = "INSERT INTO authen SET ?";
  try {
    db.query(sql, data, (error, results, fields) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: results });
    });
  } catch (err) {
    return res.json({ status: 500, result: err });
  }
});

router.post(`/user-serach`, authorization, (req, res) => {
  // console.log(req.body);
  const { userSearch, pageUser, limitUser } = req.body;
  let startIndex = (pageUser - 1) * limitUser;
  let endIndex = limitUser * pageUser;

  console.log(userSearch);
  console.log(pageUser);
  console.log(limitUser);

  const query = `%${userSearch}%`;
  const sql = `SELECT * FROM master_blog.users
  WHERE email like  ?`;

  try {
    db.query(sql, query, (error, result, fields) => {
      if (error) return res.json({ status: 404, result: error });

      const dataLenth = result.length;

      const countPage = () => {
        return parseInt(Math.ceil(dataLenth / limitUser));
      };

      const results = result.splice(startIndex, endIndex);
      console.log("results", results);
      const next = () => {
        return parseInt(pageUser) + 1;
      };

      const now = () => {
        return parseInt(pageUser);
      };

      const after = () => {
        return parseInt(pageUser) - 1;
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
    return res.json({ status: 500, result: err });
  }
});

router.post(`/user-roles`, authorization, (req, res) => {
  const { pageRoles, limitRoles } = req.body;
  let startIndex = (pageRoles - 1) * limitRoles;
  let endIndex = limitRoles * pageRoles;

  console.log("pageRoles",pageRoles);
  console.log(limitRoles);

  const sql = `SELECT a.id , a.role_name , u.email , u.short_id , a.created_at , a.updated_at , a.updated_by
  FROM authen  as a
  LEFT JOIN users  as u
  ON  a.created_by = u.id;`;

  try {
    db.query(sql, (error, result, fields) => {
      if (error) return res.json({ status: 404, result: error });

      const dataLenth = result.length;

      const countPage = () => {
        return parseInt(Math.ceil(dataLenth / limitRoles));
      };

      const results = result.splice(startIndex, endIndex);
      console.log("results", results);
      const next = () => {
        return parseInt(pageRoles) + 1;
      };

      const now = () => {
        return parseInt(pageRoles);
      };

      const after = () => {
        return parseInt(pageRoles) - 1;
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
    return res.json({ status: 500, result: err });
  }
});


// ? Delete Role
router.delete("/role/:id", authorization, (req, res) => {
  const { id } = req.params;
  console.log(id);
  const sql = "DELETE FROM authen WHERE id = ?";
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

module.exports = router;
