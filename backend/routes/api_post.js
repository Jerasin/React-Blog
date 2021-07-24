const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");

const uploadImagesList = require("../utils/uploadImageList");

const { autoGen_postID } = require("../authentication/short-running");

// ? Module is FileSystem for Manager Files
const fs = require("fs-extra");

//  Module for Create DataForm
const formidable = require("formidable");
const { JSONParser } = require("formidable");



// * Create Post
router.post("/create-post", (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      const { title, post, created_by } = fields;
      let sql_select = "SELECT short_id FROM users WHERE email = ?";
      let posts = {};
      // ? Query Select เอาค่า short_id
      db.query(sql_select, created_by, (error, short_id, fields) => {
        if (error) return res.json({ status: 404, result: error });
        let autoGen_postId = autoGen_postID();
        let posts = {
          title: title,
          post: post,
          created_by: created_by,
          post_id: short_id[0].short_id + autoGen_postId,
        };
        // console.log(posts);
        let sql_insert = " INSERT INTO posts SET ? ";
        db.query(sql_insert, posts, (error, results, fields) => {
          if (error)
            return res.json({
              status: 404,
              result: error,
            });

          // ? เช็คว่า files เป็น type obj และไม่มีค่า
          if (
            files &&
            Object.keys(files).length === 0 &&
            files.constructor === Object
          ) {
            return res.json({
              status: 200,
              result: "Successful",
            });
          }
          uploadImagesList(files, posts.post_id, res);
        });
      });
    });
  } catch (err) {
    res.json({ status: 500, result: err });
  }
});

module.exports = router;
