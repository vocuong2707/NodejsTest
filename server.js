const express = require('express');
const multer = require('multer');
const app = express();
const course = require('./Store')
const upload = multer();


app.use(express.static("./templates"));
app.set('view engine','ejs');
app.set('views','./templates');


app.get('/',(req,res)=>{

    // const course = [
    //     {
    //         id:1,
    //         name:'SQL',
    //         course_type:'CSDL',
    //         semester:'HK1-2020-2021',
    //         department:'K.CNTT'
    //     },
    //     {
    //         id:2,
    //         name:'MySQL',
    //         course_type:'CSDL',
    //         semester:'HK1-2020-2021',
    //         department:'K.CNTT'
    //     },
    //     {
    //         id:3,
    //         name:'NoSQL',
    //         course_type:'CSDL',
    //         semester:'HK1-2020-2021',
    //         department:'K.CNTT'
    //     }
    // ]
    return res.render("index",{course});
});


app.post('/', upload.fields([]), (req,res)=> {
    course.push(req.body);
    return res.redirect('/');
})

app.listen(4000,()=>{
    console.log("Server deploy sucess on port 4000");
})