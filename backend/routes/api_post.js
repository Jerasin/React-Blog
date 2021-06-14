const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");
const path = require("path");
const uploadImagesList = require("../utils/uploadImageList");

const { autoGen_postID } = require("../authentication/short-running");

// ? Module is FileSystem for Manager Files
const fs = require("fs-extra");

//  Module for Create DataForm
const formidable = require("formidable");
const { JSONParser } = require("formidable");

router.post("/create-post-test", (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      // console.log({ type: "fields", result: fields });
      // console.log({ type: "files", result: files });
      // if (
      //   files &&
      //   Object.keys(files).length === 0 &&
      //   files.constructor === Object
      // )
      //   return console.log("ไม่มีรูป");
      // if (
      //   files &&
      //   Object.keys(files).length > 0 &&
      //   files.constructor === Object
      // ) {
      const { title, post, created_by } = fields;

      let autoGen_postId = await autoGen_postID();
      let sql = "SELECT short_id FROM users WHERE email = ?";
      db.query(sql, created_by, async (error, results, fields) => {
        if (error) return console.log({ status: 404, result: error });
        let postID = (await results[0].short_id) + autoGen_postId;
        await uploadImage(files, postID, res, results[0].short_id);
      });
      // }
    });
  } catch (err) {
    console.log(err);
  }
});

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
          // console.log(posts);
          if (error)
            return res.json({
              status: 404,
              result: error,
            });

          // ? เช็คว่า files เป็น type obj และไม่มีค่า
          if (
            files &&
            Object.keys(files).length > 0 &&
            files.constructor === Object
          ) {
             uploadImagesList(
              files,
              post.post_id,
              res,
              short_id[0].short_id
            );
          }
          return res.json({
            status: 200,
            result: "Successful",
          });
        });
      });

      // res.json({
      //   status: 200,
      //   data: results,
      // });
    });
  } catch (err) {
    res.json({ status: 500, result: err });
  }
});

module.exports = router;
