const path = require("path");
const db = require("../server");
const mysql = require("mysql");

// ? Module is FileSystem for Manager Files
const fs = require("fs-extra");

// * Upload Image

// todo : วิธีใช้ function สีแดงจำเป็น สีเหลืองมีก็ได้ไม่มีก็ได้

// ! ข้อควรระวัง :  Method res ถ้าใช้ res.render res.json จะบังคับใช้ res.end บังคับตัดการเชื่อมต่อกับ db  แล้วจะ error Cannot set headers after they are sent to the client

// ! parameter 1 : ไฟล์ที่ส่งมาจาก Client
// ? parameter 2 : value postID
// ! parameter 3 : respone จาก module express
// ? parameter 4 : value shortID

module.exports = async (files, postID, res) => {
  try {
    let data_update = [];
    
    // ?  Loop หา Property name ใน Obj files
    for (const property in files) {
      // ? Loop เอา Property ใน files
      // console.log(`${property}: ${files[property].name}`)

      // ? สร้าง value แยกรูปภาพกรณีที่อัพมามากกว่า 1 รูป
      let miniId = parseInt(property.split("_")[2]);

      // ?  ลูปเอานามสกุลไฟล์
      let fileExtention = `${files[property].name}`.split(".")[1];
      // console.log( `${postID + "_" + miniId}.${fileExtention}`);

      // ? Custom Filename Ex: (product_id = 1150) + (fileExtention = .pdf)
      // ? เช็ครูปซ้ำ
      result = `${postID + "_" + miniId}.${fileExtention}`;

      // ? Custom  Newpath to save Files
      let newpath = path.resolve("./" + "/upload/images/") + "/" + result;

      // ? เช็คว่ามีชื่อไฟล์ซ้ำไหม

      if(fs.access(newpath, async (err) => {
        // ? ถ้าเช็คครั้งแรกจะ Error เนื่องจากหา Path ไม่เจอเลยใช้ Cb return
        if (err) {
          // if (err.code === "ENOENT")  console.log(err.code);
          // if (err.code !== "ENOENT")  return console.log(err.code);
        }
        // ? ถ้าเจอไฟฃ์ชื่อซ้ำจะ remoive ไฟล์เก่าออก
        
      })){
        await fs.remove(newpath);
      }
      
      // ? เอา  Files รูปภาพที่อัพโหลดไปไว้ที่ตำแหน่ง newpath
      await fs.moveSync(files[property].path, newpath);
      console.log(newpath);
      

      // ? แปลงจาก Str เป็น Arrary
      data_update.push(result);
      // console.log(data_update)
    }

    // ? นำ Arrary มาเรียงจากน้อยไปมาก
    let data_update_sort = data_update.sort();
    // console.log(data_update_sort);

    // ? แปลงจาก Arrary เป็น Obj
    let obj_update = {};
    for (let index = 0; index < data_update_sort.length; index++) {
      let row_update = "post_image_" + index;

      obj_update[row_update] = data_update_sort[index];
    }
    // console.log(obj_update);

    // ? Update database
    let data_column = postID;
    let sql = "UPDATE posts SET ? WHERE post_id = ?";

    // ? Test format SQL
    // let testsql = mysql.format(sql, [obj_update, data_column]);
    // console.log(testsql);

    // console.log(data_column);

    // ? Query Update
    db.query(sql, [obj_update, data_column], (error, results, fields) => {
      if (error){
         return res.json({ status: 404, result: error });
        
      } 
      else {
         return res.json({ status: 200, result: "Successful" });
      }
    
    });
  } catch (err) {
     return res.json({ status: 500, result: err });
  }
};
