const path = require("path");
const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");
const authorization = require("../authentication/authorize-jwt");
const _ = require("lodash");
const uploadImagesList = require("../utils/uploadImageList");

const {
  autoGen_postID,
  add_postID,
} = require("../authentication/short-running");

// ? Module is FileSystem for Manager Files
const fs = require("fs-extra");

//  Module for Create DataForm
const formidable = require("formidable");
const { JSONParser } = require("formidable");

let running_Image_Id = [];
let miniId = 0;

router.post("/uploadsimages", authorization, (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      if (error) return res.json({ status: 404, result: error });

      for (const property in files) {
        let fileExtention = `${files[property].name}`.split(".")[1];
        // console.log(files)
        // ? ออโต้เจนชื่อไฟลรูป
        let autoGen_postId = autoGen_postID();

        // ? ชื่อไฟล์รูปที่เก็บบน Server
        result = `${autoGen_postId}(${miniId}).${fileExtention}`;
        console.log(result);
        // ? Path ที่เก็บไฟลรูป
        let newpath = path.resolve("./" + "/upload/images/") + "/" + result;

        // ? Path ที่แสดงผลหน้า Web App
        let pathimg = process.env.imageUrl + "/images/" + result;
        running_Image_Id.push(pathimg);
        console.log("BeforesaveImg");
        try {
          const saveImg = await fs.moveSync(files[property].path, newpath);
        } catch (err) {
          console.log("saveImgError", err);
          res
            .status(404)
            .json({ status: 404, result: "! Running Upload Image Duplicate" });
        }
        miniId++;
        console.log(newpath);
        return res.json({ location: pathimg });
      }
    });
  } catch (err) {
    res.json({ status: 500, results: err });
  }
});

router.post("/post", authorization, async (req, res) => {
  console.log(req.body);
  try {
    let regularSrc = /src\s*=\s*"(.+?)"/g;
    let checkSrcNumber = /([0-9])\w+/g;
    let str = req.body.post;
    let resultRegular;
    let list = [];

    // ? Loop หาค่า src ของ tag img
    while ((resultRegular = regularSrc.exec(str)) !== null) {
      list.push(`${resultRegular[1]}`);
    }

    // ? Check Format Img
    checkFormatNumber = checkSrcNumber.test(list);
    // console.log(list);
    // console.log(checkFormatNumber);

    // ? เทียบ 2 Arrary เอาค่าทีี่ไม่ซ้ำไปสร้าง Arrary ใหม่
    let result = _.difference(running_Image_Id, list);
    if (result.length !== 0) {
      // ? Loop หารูปที่ไม่ได้ใช้และลบทิ้ง
      for (let index = 0; index < result.length; index++) {
        let deleteImg = result[index].split("/")[4];
        console.log(deleteImg);
        let deletePath =
          path.resolve("./" + "/upload/images/") + "/" + deleteImg;
        await fs.remove(deletePath);
      }
    }

    const { title, post, user_created, category } = req.body;

    let data = {
      title: title,
      posts: post,
      user_created: user_created,
      category_id: category,
    };

    let sql = "INSERT INTO posts_texteditor SET ? ";

    // ? Test Query
    // let testsql = mysql.format(sql, data);
    // console.log(testsql);

    // ? เพิ่มค่า Post id
    add_postID();

    // ? เซตค่าเริ่มต้นใหม่
    running_Image_Id = [];
    miniId = 0;

    db.query(sql, data, (error, fields, files) => {
      if (error) {
        console.log("Error DB",error);
        res.json({ status: 404, result: error });
        return;
      }

      res.json({ status: 200, result: fields });
      return;
    });
  } catch (error) {
    res.json({ status: 500, result: error });
    return;
  }
});

// ? Get All Posts
router.get("/posts", authorization, (req, res) => {
  try {
    let sql =
      " SELECT p.id  , p.title  , c.language , u.email , p.created_at FROM master_blog.posts_texteditor AS p LEFT JOIN category AS c ON  p.category_id = c.id LEFT JOIN users AS u ON  p.user_created =  u.short_id limit 10 ";
    db.query(sql, (error, fields, files) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields });
    });
  } catch (error) {
    res.json({ status: 500, result: error });
  }
});

// ? Get Post By Email
router.post("/post-email/:id", authorization, (req, res) => {
  let { id } = req.params;

  try {
    let sql =
      " SELECT p.id , p.title , p.posts , u.email , c.language , p.created_at FROM posts_texteditor AS p LEFT JOIN users AS u ON p.user_created =  u.short_id LEFT JOIN category AS c ON category_id = c.id WHERE u.email = ?";
    // let testsql = mysql.format(sql, id);
    // console.log(testsql);

    db.query(sql, id, (error, fields, files) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields });
    });
  } catch (error) {
    res.json({ status: 500, result: error });
  }
});

// ? Get Post By Id
router.post("/post-id/:id", authorization, (req, res) => {
  let { id } = req.params;
  try {
    let sql =
      " SELECT p.id as post_id , p.title , p.posts , u.email , c.id as category_id , c.language , p.created_at FROM posts_texteditor AS p LEFT JOIN users AS u ON p.user_created =  u.short_id LEFT JOIN category AS c ON category_id = c.id WHERE p.id = ?";
    // let testsql = mysql.format(sql, id);
    // console.log(testsql);

    db.query(sql, id, (error, fields, files) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields });
    });
  } catch (error) {
    res.json({ status: 500, result: error });
  }
});

// ? Update
router.put(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const { title, post, category, user_created, initialPost } = req.body;
  try {
    let regularSrc = /src\s*=\s*"(.+?)"/g;
    let checkSrcNumber = /([0-9])\w+/g;
    let str = initialPost;
    let resultRegular;
    let listDeleteImg = [];

    // ? Loop หาค่า src ของ tag img
    while ((resultRegular = regularSrc.exec(str)) !== null) {
      listDeleteImg.push(`${resultRegular[1]}`);
    }

    // ? Check Format Img
    checkFormatNumber = checkSrcNumber.test(listDeleteImg);

    // ? เทียบ 2 Arrary เอาค่าทีี่ไม่ซ้ำไปสร้าง Arrary ใหม่
    let result = _.difference(listDeleteImg, running_Image_Id);

    if (result.length !== 0) {
      // ? Loop หารูปที่ไม่ได้ใช้และลบทิ้ง
      for (let index = 0; index < result.length; index++) {
        let deleteImg = result[index].split("/")[4];
        console.log(deleteImg);
        let deletePath =
          path.resolve("./" + "/upload/images/") + "/" + deleteImg;
        await fs.remove(deletePath);
      }
    }
    const checkType = typeof category;
    if (checkType === "string") {
      const data = {
        title: title,
        posts: post,
        updated_by: user_created,
        updated_at: new Date(),
      };
      const sql = "UPDATE posts_texteditor SET ? WHERE id = ?  ";
      db.query(sql, [data, id], (error, fields, files) => {
        if (error) return console.error(error);
        res.json({ status: 200, result: fields });
      });
    } else {
      const dataFull = {
        title: title,
        post: post,
        updated_by: user_created,
        category_id: category,
        updated_at: new Date(),
      };
      const sql = "UPDATE posts_texteditor SET ? WHERE id = ?  ";
      db.query(sql, [dataFull, id], (error, fields, files) => {
        if (error) return console.error(error);
        res.json({ status: 200, result: fields });
      });
    }
  } catch (err) {
    console.error(err);
    res.json({ status: 500, result: error });
  }
});

// ? Delete Post
router.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  let regularSrc = /src\s*=\s*"(.+?)"/g;
  let checkSrcNumber = /([0-9])\w+/g;
  let str;
  let resultRegular;
  let listDeleteImg = [];

  try {
    const sql_select = "SELECT posts FROM posts_texteditor WHERE id = ?";
    db.query(sql_select, id, async (error, fields, files) => {
      if (error) return res.json({ status: 404, result: error })

      str = fields[0].posts;

      // ? Loop find value src for tag img
      while ((resultRegular = regularSrc.exec(str)) !== null) {
        listDeleteImg.push(`${resultRegular[1]}`);
      }

      // ? Check Format Img
      checkFormatNumber = checkSrcNumber.test(listDeleteImg);
      // console.log(listDeleteImg);

      // ? Delete Img On Server By Path
      if (listDeleteImg.length !== 0) {
        // ? Loop หารูปที่ไม่ได้ใช้และลบทิ้ง
        for (let index = 0; index < listDeleteImg.length; index++) {
          let deleteImg = listDeleteImg[index].split("/")[4];
          
          let deletePath =
            path.resolve("./" + "/upload/images/") + "/" + deleteImg;
          await fs.remove(deletePath);
        }
      }
    });

    // ?  Query Delete on DB
    const sql = "DELETE FROM posts_texteditor WHERE id = ?";

      db.query(sql, id, (error, fields, files) => {
        if (error) return res.json({ status: 404, result: error });
        return res.json({ status: 200, result: fields });
      });

  } catch (err) {
    return res.status(500).json({ status: 500, result: err });
  }
});

module.exports = router;
