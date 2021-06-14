// * Upload Image

// todo : วิธีใช้ function สีแดงจำเป็น สีเหลืองมีก็ได้ไม่มีก็ได้

// ! parameter 1 : ไฟล์ที่ส่งมาจาก Client
// ? parameter 2 : value postID
// ! parameter 3 : respone จาก module express
// ? parameter 4 : value shortID

module.exports = async (files, postID, res, shortID) => {
  try {
    if (Object.keys(files).length === 0)
      return console.log("No Images" + " " + "shortID:" + postID);
    // ?  Split  fileExtention

    // ?  Loop หา Property name ใน Obj files
    let data_update = [];
    for (const property in files) {
      // ? Loop เอา Property ใน files
      // console.log(`${property}: ${files[property].name}`)

      // ? สร้าง value แยกรูปภาพกรณีที่อัพมามากกว่า 1 รูป
      let miniId = await parseInt(property.split("_")[2]);

      // ?  ลูปเอานามสกุลไฟล์
      let fileExtention = await `${files[property].name}`.split(".")[1];
      // console.log( doc +miniId + fileExtention);

      // ? Custom Filename Ex: (product_id = 1150) + (fileExtention = .pdf)
      // ? เช็ครูปซ้ำ
      result = await `${postID + "_" + miniId}.${fileExtention}`;

      // ? Custom  Newpath to save Files
      let newpath =
        (await path.resolve("./" + "/upload/images/")) + "/" + result;

      // ? เช็คว่ามีชื่อไฟล์ซ้ำไหม
      if (
        await fs.access(newpath, (err) => {
          // ? ถ้าเช็คครั้งแรกจะ Error เนื่องจากหา Path ไม่เจอเลยใช้ Cb return
          if (err) {
            if (err.code === "ENOENT") return;
          }
          return console.log(err);
        })
      ) {
        // ? ถ้าเจอไฟฃ์ชื่อซ้ำจะ remoive ไฟล์เก่าออก
        await fs.remove(newpath);
      }

      // ? เอา  Files รูปภาพที่อัพโหลดไปไว้ที่ตำแหน่ง newpath
      await fs.moveSync(files[property].path, newpath);

      // ? แปลงจาก Str เป็น Arrary
      await data_update.push(result);
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
    let data_column = shortID;
    let sql = "UPDATE posts SET ? WHERE short_id = ?";

    // ? Test format SQL
    console.log(
      mysql.format("UPDATE user SET ? WHERE ?", [obj_update, data_column])
    );

    // ? Query Update
   try{
    db.query(sql, [obj_update, data_column], (error, results, fields) => {
        if (error) return res.json({ status: 400, result: error });
        return;
        res.json({ status: 200, result: "Successful Images" });
      });
   }
   catch(err){
    return res.json({ status: 500, result: err });
   }
  } catch (err) {
    return res.json({ status: 500, result: err });
  }
};
