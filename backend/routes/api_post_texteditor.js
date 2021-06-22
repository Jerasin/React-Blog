const path = require("path");
const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");
const authorization = require("../authentication/authorize-jwt");
const  _ = require('lodash');
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
let miniId = 0 ;
router.post("/uploadsimages", authorization, (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      if (error) return console.log(error);
      
      for (const property in files) {
        let fileExtention = `${files[property].name}`.split(".")[1];

        // ? ออโต้เจนชื่อไฟลรูป
        let autoGen_postId = autoGen_postID();

        // let miniId = parseInt(files[property].name.split("")[6]);

        // ? ชื่อไฟล์รูปที่เก็บบน Server
        result = `${autoGen_postId}(${miniId}).${fileExtention}`;

        // ? Path ที่เก็บไฟลรูป
        // let newpath =
        //   path.resolve("./" + "/upload/temporary_images/") + "/" + result;
        let newpath = path.resolve("./" + "/upload/images/") + "/" + result;

        // ? Path ที่แสดงผลหน้า Web App
        let pathimg = process.env.imageUrl + "/images/" + result;
        running_Image_Id.push(pathimg);
        console.log(pathimg)
        // ? เช็คว่ามีชื่อไฟล์ซ้ำไหม

        //   if (fs.access(newpath), async(err, data)=>{
        //     if(err) return console.error(err);
        //     console.log(data)
        //     // ? ถ้าเจอไฟฃ์ชื่อซ้ำจะ remoive ไฟล์เก่าออก
        //     console.log("fs.access");
        //     await fs.remove(newpath);

        // })

        // if (fs.access(newpath)) {
        //   console.log("fs.remove");
        //   await fs.remove(newpath);
        // }

        console.log("fs.moveSync");
        await fs.moveSync(files[property].path, newpath);
        miniId++ ;
        // running_Image_Id = running_Image_Id + 1
        
        return res.json({ location: pathimg });
      }
    });
  } catch (err) {
    res.json({ status: 500, results: err });
  }
});

router.post("/post", authorization, async (req, res) => {
  try {
    // console.log(req.body.post);
    let regularSrc = /src\s*=\s*"(.+?)"/g;
    let str = req.body.post;
    let resultRegular;
    let list = [];

    while ((resultRegular = regularSrc.exec(str)) !== null) {
      list.push(`${resultRegular[1]}`);
    }

    console.log(running_Image_Id);
    console.log(list);

    // ? เทียบ 2 Arrary เอาค่าทีี่ไม่ซ้ำไปสร้าง Arrary ใหม่
    let result = _.difference(running_Image_Id, list);
    if(result.length !== 0){

      // ? Loop หารูปที่ไม่ได้ใช้และลบทิ้ง
      for (let index = 0; index < result.length; index++) {
        let deleteImg = result[index].split("/")[4];
        console.log(deleteImg)
        let deletePath = path.resolve("./" + "/upload/images/") + "/" + deleteImg
        await fs.remove(deletePath);
      }
    }

    const { title, post, user_created, category } = req.body;
    // running_Image_Id = 0;
    let data = {
      title: title,
      posts: JSON.stringify(post),
      user_created: user_created,
      category_id: category,
    };
    // console.log(data);
    let sql = "INSERT INTO posts_texteditor SET ? ";

    // ? Test Query
    let testsql = mysql.format(sql, data);
    add_postID();

    // ? เซตค่าเริ่มต้นใหม่
    running_Image_Id = [];
    miniId = 0 ;

    db.query(sql, data, (error, fields, files) => {
      if (error) {
        // console.log(error);
        res.json({ status: 500, result: error });
        return;
      }
      // console.log(fields);
      res.json({ status: 200, result: fields });
      return;
    });

    // console.log(rex.exec( str ));
  } catch (err) {
    console.log(err);
  }
});

router.get("/post", authorization, (req, res) => {
  let id = 1;
  let sql = "SELECT * FROM posts_texteditor LIMI ";
  db.query(sql, id, (error, fields, files) => {
    if (error) return res.json({ status: 404, result: error });
    return res.json({ status: 200, result: fields });
  });
});

module.exports = router;
