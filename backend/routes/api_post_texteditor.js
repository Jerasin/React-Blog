const path = require("path");
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


router.post("/uploadsimages" , (req,res)=>{
  try {
    let localtion ;
    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      if(error) return console.log(error);
      for (const property in files) {
        console.log(files[property].name)
        let fileExtention = `${files[property].name}`.split(".")[1];
        let autoGen_postId = autoGen_postID();
        result = `${autoGen_postId}.${fileExtention}`;
        let newpath = path.resolve("./" + "/upload/images/") + "/" + result;
        let pathimg = "http://127.0.0.1:4000/images/"  + result;
        await fs.moveSync(files[property].path, newpath);
        // res.json({status: 200 ,results: files})
        test = newpath
        console.log(pathimg)
        return res.json({location: pathimg})
      }
      
      // console.log(test)
      
    })
  } catch (err) {
    res.json({status:500 ,results: err});
  }
})

router.post("/post", (req, res) => {
  try {
    //    console.log(req.body.post)
    const { title, post } = req.body;
    
    let data = {
      title: title,
      posts: JSON.stringify(post),
    };
    console.log(data)
    let sql = "INSERT INTO posts_texteditor SET ? ";

    let testsql = mysql.format(sql, data);
    console.log(testsql);

    db.query(sql, data, (error, fields, files) => {
      if (error) return console.log(error);
      return console.log(fields);
    });

    // console.log(rex.exec( str ));
  } catch (err) {
    console.log(err);
  }
});


router.get("/post" , (req, res) => {
    let id = 1;
    let sql = "SELECT * FROM posts_texteditor where id = ?"
    db.query(sql,id, (error, fields, files) => {
        if(error) return res.json({status: 404 , result: error});
        return res.json({status:200 , result: fields})
    })
})

module.exports = router;
