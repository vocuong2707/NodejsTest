const express = require('express');
const multer = require('multer');
const app = express();
const path = require("path");
// const course = require('./Store')


// AWS
const AWS = require("aws-sdk");
require("dotenv").config();

// AWS_SDK_LOAD_CONFIG="1"
// cau hinh AWS
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
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
    if(extname && mimetype) {
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


app.post('/save', upload.single('image'), (req,res)=> {
    // const img = req.file.originalname.split('.');
    const newCourse = {
        ...req.body,
        image: req.file.key,
      };
    console.log(newCourse);
    return res.redirect('/');
})

app.listen(4000,()=>{
    console.log("Server deploy sucess on port 4000");
})