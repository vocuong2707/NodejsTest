const express = require('express');
const multer = require('multer');
const app = express();
// const course = require('./Store')
 AWS_SDK_LOAD_CONFIG=1

// AWS
const AWS = require("aws-sdk");
require("dotenv").config();
// cau hinh AWS
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKeyId:process.env.SECRET_ACCESS_KEY
})
// khoi tao AWS S3  , DynamoDb
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Book';

// cau hinh app
app.use(express.static("./templates"));
app.set('view engine','ejs');
app.set('views','./templates');

// cau hinh multer
const storage = multer.memoryStorage({
    destination(req,file,callback) {
        callback(null,'');
    }
})

const upload = multer({
    storage,
    limits:{fileSize:2000000}, // gioi han dung luong file
    fileFilter(req,file,cb) {
        checkFile(file,cb)
    }
})

// Check file
const checkFile = function(file,cb){
    const fileType = /jpeg|jpg|png|gif/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);
    if(ext && mimetype) {
        return cb(null,true);
    }
    return cb("Error : Image Only Pls!");
}


app.get('/',async (req,res)=>{

    try {
        const params = {TableName : tableName};
        const data = await dynamodb.scan(params).promise();
        return res.render("index",{data : data.Items});
    } catch (error) {
        console.log("Error retrieving data from DynamoDb",error);
        // return res.status(500).send("Internal Server Error")
    }
    
});


app.post('/', upload.fields([]), (req,res)=> {
    course.push(req.body);
    return res.redirect('/');
})

app.listen(4000,()=>{
    console.log("Server deploy sucess on port 4000");
})