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

        // ? ออโต้เจนชื่อไฟลรูป
        let autoGen_postId = autoGen_postID();

        // ? ชื่อไฟล์รูปที่เก็บบน Server
        result = `${autoGen_postId}(${miniId}).${fileExtention}`;

        // ? Path ที่เก็บไฟลรูป
        let newpath = path.resolve("./" + "/upload/images/") + "/" + result;

        // ? Path ที่แสดงผลหน้า Web App
        let pathimg = process.env.imageUrl + "/images/" + result;
        running_Image_Id.push(pathimg);

        await fs.moveSync(files[property].path, newpath);
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
  console.log(req.body)
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
    console.log(list);
    console.log(checkFormatNumber);

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
      posts: JSON.stringify(post),
      user_created: user_created,
      category_id: category,
    };
    console.log(category);
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
        console.log(error);
        res.json({ status: 404, result: error });
        return;
      }
      // console.log(fields);
      res.json({ status: 200, result: fields });
      return;
    });
  } catch (error) {
    res.json({ status: 500, result: error });
    return;
  }
});

// ? Get All Posts
router.get("/post", authorization, (req, res) => {
  try {
    let sql =
      " SELECT p.id  , p.title  , c.laguange , u.email , p.created_at FROM master_blog.posts_texteditor AS p LEFT JOIN category AS c ON  p.category_id = c.id LEFT JOIN users AS u ON  p.user_created =  u.short_id limit 10 ";
    db.query(sql, (error, fields, files) => {
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields });
    });
  } catch (error) {
    res.json({ status: 500, result: error });
  }
});

// ? Get Post By id
router.get("/post/:id", authorization, (req, res) => {
  try {
    let {id} = req.params
    let sql = " SELECT p.id , p.title , p.posts , u.email , c.laguange , p.created_at FROM posts_texteditor AS p LEFT JOIN users AS u ON p.user_created =  u.short_id LEFT JOIN category AS c ON category_id = c.id WHERE p.id = ?";
    let testsql = mysql.format(sql, id);
    console.log(testsql);

    db.query(sql,id,(error, fields, files)=>{
      if (error) return res.json({ status: 404, result: error });
      return res.json({ status: 200, result: fields})
    })
  } catch (error) {
    res.json({ status: 500, result: error });
  }
});

module.exports = router;
