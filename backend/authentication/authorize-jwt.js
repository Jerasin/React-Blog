const jwt = require('jsonwebtoken')  // ใช้งาน jwt module


// Import Config File Env
const dotenv = require("dotenv");
dotenv.config();

// สร้าง middleware ฟังก์ชั่นสำหรับ verification token
const authorization = ((req, res, next) => {
    

    // ? ดึงข้อมูล authorization ใน header
    const authorization = req.headers['authorization']  
    // ? ถ้าไม่มีการส่งค่ามา ส่ง ข้อความ json พร้อม status 401 Unauthorized
    if(authorization===undefined) return res.status(401).json({
        "status": 401,
        "message": "Unauthorized Header"
    })   
    // ถ้ามีการส่งค่ามา แยกเอาเฉพาะค่า token จากที่ส่งมา 'Bearer xxxx' เราเอาเฉพาะ xxxx
    // แยกข้อความด้วยช่องว่างได้ array สองค่า เอา array key ตัวที่สองคือ 1 
    // array key เริ่มต้นที่ 0 จะเได้ key เท่ากับ 1 คือค่า xxxx ที่เป้น token
    const token = req.headers['authorization'].split(' ')[1]
    if(token===undefined) return res.status(401).json({ // หากไมมีค่า token
        "status": 401,
        "message": "Unauthorized Token"
    })   
    
    
    // ทำการยืนยันความถูกต้องของ token
    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
        if(error) return res.status(401).json({ // หาก error ไม่ผ่าน
            "status": 401,
            "message": "Unauthorized JWT",
            "LogError": error,
        })   
        // console.log(error)
        // console.log(decoded)     
        // หากตรวจสอบยืนยันแล้ว ผ่าน
        // ตรงนี้ จะกำหนดสิทธิ์เพิ่มเติม  มีหรือไม่ก็ได้ ในกรณีนี้   เราตรวจสอบเพิ่มเติมว่า 
        // decoded.role ต้องเป็น 'admin' ด้วยถึงจะแสดงข้อมูลได้ ซึ่งค่า role นี้เราจะส่งมากับ payload
        // ถ้าไม่ผ่าน เช่นไม่ได้ส่งค่า role มาด้วยหรือ ค่า role เป็น 'user' ไม่ใช่ 'admin' ก็จะส่งค่า status 403 Forbidden

        // if(decoded.role===undefined || decoded.role!=='admin') return res.status(403).json({
        //     "status": 403,
        //     "message": "Forbidden"
        // })   
        
        // ถ้าทุกอย่างผ่าน ทุกเงื่อนไข ก็ไปทำ middleware ฟังก์ชั่นในลำดับถัดไป
        next()
    })
})
 
module.exports = authorization   // ส่ง middleware ฟังก์ชั่นไปใช้งาน