const express = require("express");
const db = require("../server");
const router = express.Router();
const mysql = require("mysql");

//  Module for Create DataForm
const formidable = require("formidable");

router.get("/", (req, res) => {
  res.json({ message: "hello world!" });
});

router.post("/create-post", (req, res) => {
  try{
    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      const {title , post , created_by} = fields
      // console.log(fields)
      let posts = {
        title: title,
        post: post,
        created_by: created_by
      }
      console.log(posts)
      let sql = " INSERT INTO posts SET ? ";
      db.query(sql, posts , (error, results, fields) => {
        if(error) 
        // return res.json({
        //   status: 404,
        //   result: error
        // })
        return console.log(error)
        const result = {
          status: 200,
          data: results,
        };
        console.log(result);
      })
    })
  }
  catch(err){
    res.json({status: 500 ,result: err})
  }
});

module.exports = router;
