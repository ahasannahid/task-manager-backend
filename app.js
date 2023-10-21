const express = require('express');
const router = require('./src/routes/api');

const app = new express();

// security middleware import
 const rateLimit = require('express-rate-limit');
 const helmet = require('helmet');
 const mongoSanitize = require('express-mongo-sanitize');
//  const xss = require('xss-clean');
 const hpp = require('hpp');
 const cors = require('cors');
 const mongoose = require('mongoose')
 
// security middleware implement


 app.use(express.json());
 app.use(cors());
 app.use(helmet());
 app.use(mongoSanitize());
//  app.use(xss());
 app.use(hpp());

// request rate limit
const limiter = rateLimit({
    windowMs : 15 * 60 * 1000, //15 min
    max : 100  //limit maximum 100
})

 app.use(limiter);


const URI = "mongodb://127.0.0.1:27017/task-manager";

mongoose.connect(URI)
.then(() => {
    console.log('db Connected')
})
.catch((err) => {
    console.log(err)
})


// route implement

app.use("/api/v1", router);



// undefine route
app.use('*', (req,res) => {
    res.status(404).json({
        status: "fail",
        data : "Not found"
    })
})

module.exports= app;