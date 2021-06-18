const path = require("path");
const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");

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

router.post("/uploadsimages", (req, res) => {
  try {
    let localtion;
    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      if (error) return console.log(error);
      for (const property in files) {
        console.log(files[property].name);
        let fileExtention = `${files[property].name}`.split(".")[1];

        // ? ออโต้เจนชื่อไฟลรูป
        let autoGen_postId = autoGen_postID();

        let subImage = 1;

        // ? ชื่อไฟล์รูปที่เก็บบน Server 
        result = `${autoGen_postId} (${subImage}) .${fileExtention}`;

        // ? Path ที่เก็บไฟลรูป
        let newpath = path.resolve("./" + "/upload/images/") + "/" + result;

        // ? Path ที่แสดงผลหน้า Web App
        let pathimg = process.env.imageUrl + "/images/" + result;

        // ? เช็คว่ามีชื่อไฟล์ซ้ำไหม

        if (
          fs.access(newpath, async (err) => {
            // ? ถ้าเช็คครั้งแรกจะ Error เนื่องจากหา Path ไม่เจอเลยใช้ Cb return
            if (err) {
              // if (err.code === "ENOENT")  console.log(err.code);
              // if (err.code !== "ENOENT")  return console.log(err.code);
            }
            // ? ถ้าเจอไฟฃ์ชื่อซ้ำจะ remoive ไฟล์เก่าออก
          })
        ) {
          await fs.remove(newpath);
        }
        
        await fs.moveSync(files[property].path, newpath);

        subImage = subImage + 1;
        return res.json({ location: pathimg });
      }

      // console.log(test)
    });
  } catch (err) {
    res.json({ status: 500, results: err });
  }
});

router.post("/post", (req, res) => {
  try {
    //    console.log(req.body.post)
    const { title, post, user_created } = req.body;

    let data = {
      title: title,
      posts: JSON.stringify(post),
      user_created: user_created,
    };
    console.log(data);
    let sql = "INSERT INTO posts_texteditor SET ? ";

    let testsql = mysql.format(sql, data);
    add_postID();
    db.query(sql, data, (error, fields, files) => {
      if (error) return console.log(error);
      return console.log(fields);
    });

    // console.log(rex.exec( str ));
  } catch (err) {
    console.log(err);
  }
});

router.get("/post", (req, res) => {
  let id = 1;
  let sql = "SELECT * FROM posts_texteditor where id = ?";
  db.query(sql, id, (error, fields, files) => {
    if (error) return res.json({ status: 404, result: error });
    return res.json({ status: 200, result: fields });
  });
});

module.exports = router;
