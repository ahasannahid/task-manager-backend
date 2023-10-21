const UsersModel = require("../models/UsersModel");
const jwt = require("jsonwebtoken");
const OTPModel = require("../models/OTPModel");
const SendEmailUtility = require("../utility/SendEmailUtility");


// // Registration
exports.registration = async (req, res) => {
    const reqBody = req.body
    try {

        const result = await UsersModel.create(reqBody);
        res.status(200).json({ status: "success", data: result });
    }
    catch (error) {
        res.status(200).json({ status: "fail", data: error.toString() });
    }
}


exports.login = async (req, res) => {

    try {
        const reqBody = req.body;
        const result = await UsersModel.find(reqBody).count();
        if (result === 1) {
            // Create Token
            const Payload = {
                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
                data: reqBody['email']
            }
            const token = jwt.sign(Payload, "SecretKey123456789");
            res.status(200).json({ status: "success", data: token })

        }
        else {
            // Login fail
            res.status(200).json({ status: "fail", data: "No User Found" })
        }
    }
    catch (e) {
        res.status(200).json({ status: "fail", data: e })
    }
}

exports.profileUpdate = async (req, res) => {

    try {
        const email = req.headers['email'];
        const reqBody = req.body;
        const result = await UsersModel.updateOne({ email: email }, reqBody)
        res.status(200).json({ status: "success", data: result })
    }
    catch (e) {
        res.status(200).json({ status: "fail", data: e })
    }
}

exports.profileDetails = async (req, res) => {
    try {
        const email = req.headers['email'];
        const result = await UsersModel.find({ email: email });
        res.status(200).json({ status: "success", data: result })
    }
    catch (e) {
        res.status(200).json({ status: "fail", data: e })
    }
}

exports.RecoverVerifyEmail=async (req,res)=>{
    const email = req.params.email;
    const OTPCode = Math.floor(100000 + Math.random() * 900000);
    const EmailText="Your Verification Code is ="+OTPCode
    const EmailSubject="Task manager verification code"

    const result= await UsersModel.find({email:email}).count();
    if(result===1){
        // Verification Email
       await SendEmailUtility(email,EmailText,EmailSubject);
       await OTPModel.create({email:email,otp:OTPCode})
       res.status(200).json({status:"success",data:"6 Digit Verification Code has been send"})

    }
    else{
        res.status(200).json({status:"fail",data:"No User Found"})
    }

}

exports.RecoverVerifyOTP=async (req,res)=>{
    const email = req.params.email;
    const OTPCode = req.params.otp;
    const status=0;
    const statusUpdate=1;

    const result= await OTPModel.find({email:email,otp:OTPCode,status:status}).count();
    // Time Validation 2 min
    if(result===1){
        await OTPModel.updateOne({email:email,otp:OTPCode,status:status}, {status:statusUpdate})
        res.status(200).json({status:"success",data:"Verification Completed"})
    }
    else{
        res.status(200).json({status:"fail",data:"Invalid Verification"})
    }

}

exports.RecoverResetPass=async (req,res)=>{

    const email = req.body['email'];
    const OTPCode = req.body['OTP'];
    const NewPass =  req.body['password'];
    const statusUpdate=1;

    const result= await OTPModel.find({email:email,otp:OTPCode,status:statusUpdate}).count();
    if(result===1){
        const result=await UsersModel.updateOne({email: email}, {password:NewPass})
        res.status(200).json({status:"success",data:"Password Reset Success"})
    }
    else{
        res.status(200).json({status:"fail",data:"Invalid Verification"})
    }
}
