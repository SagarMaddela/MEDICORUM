
const path = require('path')
const mongoose = require('mongoose')
const User = require('../model/user')
const Doctor = require('../model/doctor')
const appointment = require('../model/appointments')
const jwt = require('jsonwebtoken');
const accappointment = require('../model/acceptedappointments');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const Leave = require('../model/leave')
const prescription =require('../model/medication')
const reportdb = require('../model/report')
const cookieParser = require('cookie-parser');
const { json } = require('express');
const express = require('express')
const app = express()
app.use(express.urlencoded({extended:false}))
async function renderdstudentlogin(req,res){
    res.render(path.resolve(__dirname,'../views/student/login1.ejs'));
}
async function getstudenthome(req, res) {
    try {
        const date = new Date();
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() + 2);

        let appointments, prescriptions;
        const userDetailsCookie = req.cookies?.userdetails;
        let emailaddress;

        if (!userDetailsCookie) {
            const token = req.cookies?.Uid2;
            const detoken = jwt.verify(token, "druva123");
            const gmail = detoken.gmail;
            emailaddress = gmail;

            prescriptions = await prescription.find({
                createdfor: emailaddress,
                createdon: { $lt: twoDaysAgo }
            }).sort({createdon:-1});

            appointments = await accappointment.find({
                date: { $gte: new Date() },
                createdy: gmail
            }).sort({ date: 1, time: 1 });
        } else {
            const { gmail } = JSON.parse(userDetailsCookie);
            emailaddress = gmail;

            prescriptions = await prescription.find({
                createdfor: emailaddress,
                createdon: { $lt: twoDaysAgo }
            }).sort({createdon:-1});

            appointments = await accappointment.find({
                date: { $gte: new Date() },
                createdy: gmail
            }).sort({ date: 1, time: 1 });
        }

        console.log(emailaddress);
        console.log(appointments);
        console.log(prescriptions);

        return res.render(path.resolve(__dirname, '../views/student/home.ejs'), { appointments, emailaddress, prescriptions });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).send('Internal Server Error');
    }
}
async function poststudenthome(req,res){
    try {
        const { email, password1, checkbox } = req.body;
        let gmail1 = email
    let carray = gmail1.split('@')[1]
    if(carray!='iiits.in'){
        return res.send('please use IIITs Email')
}
        const specificUser = await User.findOne({ gmail: email, password: password1 });
        if (!specificUser) {
            console.log('No user found');
            return res.render(path.resolve(__dirname,'../views/student/login1.ejs'))
        }
        if (checkbox) {
            const token = jwt.sign({
                gmail: specificUser.gmail,
            }, "druva123");
            res.cookie("Uid2", token, { maxAge: 24 * 60 * 60 * 1000 });
            console.log('Token:', token);
        }
        res.cookie("userdetails", JSON.stringify({
            gmail: specificUser.gmail,
        }));
        const appointments = await appointment.find({
            date: {
                $gte: new Date(),
            },
            createdy: specificUser.gmail,
        }).sort({ date: 1, time: 1 });

        return res.redirect('/student/home')
    } catch (error) {
        console.error('Error processing student login:', error);
        return res.status(500).send('Internal Server Error');
    }
}
async function poststudenthome1(req,res){
    const {email,password1,password2}=req.body
    let gmail1 = email
    let carray = gmail1.split('@')[1]
    if(carray!='iiits.in'){
        return res.send('please use IIITs Email')
}
    console.log(email+password1+password2)
    if(password1 == password2){
        await User.create({
            gmail:email,
            password:password1
        })

        res.redirect('/student/login')
    }
    else{
        return res.send('password doesnot match')
    }
}
const ObjectId = mongoose.Types.ObjectId;
async function getstudentschedule(req, res) {
    let emailaddress = null; 
    const userDetailsCookie = req.cookies?.userdetails;
    if (userDetailsCookie) {
        const { gmail } = JSON.parse(userDetailsCookie);
        emailaddress = gmail;
    } else {
        const token = req.cookies?.Uid2;
        if (token) {
            const detoken = jwt.verify(token, "druva123");
            emailaddress = detoken.gmail;
        }
    }
    try {
        const result = await prescription.aggregate([
            {
                $match: {
                    createdfor: emailaddress 
                }
            },
            {
                $lookup: {
                    from: 'accappointments', 
                    localField: 'bookedon',
                    foreignField: '_id',
                    as: 'appointmentDetails'
                }
            },
            {
                $match: {
                    appointmentDetails: { $exists: true, $ne: [] } 
                }
            }
        ]).exec();
        
        console.log(result);
        res.render(path.resolve(__dirname, '../views/student/schedule.ejs'), { emailaddress, result });
    } catch (error) {
        console.error('Error fetching student schedule:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getstudentappoinment(req,res){
    const userDetailsCookie = req.cookies?.userdetails;
        let emailaddress;
        if (!userDetailsCookie) {
            const token = req.cookies?.Uid2;
            const detoken = jwt.verify(token, "druva123");
            const gmail = detoken.gmail;
            emailaddress = gmail
        }
        else {
            const { gmail } = JSON.parse(userDetailsCookie);
            emailaddress = gmail
        }
    res.render(path.resolve(__dirname,'../views/student/appointment.ejs'),{emailaddress})
}
async function getstudentstudentbookings(req,res){
    try {
        const today = new Date(); 
           let emailaddress
           const userDetailsCookie = req.cookies?.userdetails;
        if (!userDetailsCookie) {
            const token = req.cookies?.Uid2;
            const detoken = jwt.verify(token, "druva123");
            const gmail = detoken.gmail;
            emailaddress=gmail
             appointments = await accappointment.find({
                date: {
                    $gte: today,
                },
                createdy: gmail
            }).sort({ date: 1, time: 1 });
            appointments1 = await appointment.find({
                date: {
                    $gte: today,
                },
                createdy: gmail
            }).sort({ date: 1, time: 1 });
        } else {
            const { gmail } = JSON.parse(userDetailsCookie);
            emailaddress=gmail
            appointments = await accappointment.find({
                date: {
                    $gte: today,
                },
                createdy: gmail
            }).sort({ date: 1, time: 1 });
            appointments1 = await appointment.find({
                date: {
                    $gte:today,
                },
                createdy: gmail
            }).sort({ date: 1, time: 1 });
        }
        

        
        res.render(path.resolve(__dirname,'../views/student/bookings.ejs'),{appointments,appointments1,emailaddress})
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).send('Internal Server Error');
    }
}
async function getstudentsettings(req,res){
    const userDetailsCookie = req.cookies?.userdetails;
    let emailaddress;
    if (!userDetailsCookie) {
        const token = req.cookies?.Uid2;
        const detoken = jwt.verify(token, "druva123");
        const gmail = detoken.gmail;
        emailaddress = gmail
    }
    else {
        const { gmail } = JSON.parse(userDetailsCookie);
        emailaddress = gmail
    }
    res.render(path.resolve(__dirname,'../views/student/settings.ejs'),{emailaddress})
}
async function poststudentappointment(req,res){
    try {
        const { date, time, description } = req.body;
        const token = req.cookies?.Uid2;
        const userdetails = req.cookies?.userdetails;
        
        let createdy;
        if (userdetails) {
            const { gmail } = JSON.parse(userdetails);
            createdy = gmail;
        } else {
            const decodedToken = jwt.verify(token, "druva123");
            createdy = decodedToken.gmail;
        }

        const currentDateTime = new Date();
        const appointmentDateTime = new Date(`${date} ${time}`);
        
        if (appointmentDateTime > currentDateTime) {
            const createduser = await appointment.create({
                date: appointmentDateTime,
                time,
                description,
                createdy,
                created:Date()
            });
            console.log('Appointment created:', createduser);
        } else {
            console.log('Error: Appointment date and time must be in the future');
            return res.status(400).send('Appointment date and time must be in the future');
        }

        console.log(description);
        res.redirect("/student/appointment");
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).send('Internal Server Error');
    }
}
async function studentcancel(req,res){
    try {
        const appointmentId = req.body.appointmentId;
        await accappointment.findByIdAndDelete(appointmentId);
        res.redirect('/student/bookings');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error cancelling appointment');
    }
   
}
async function studentcancel1(req,res){
    try {
        const appointmentId = req.body.appointmentId;
        await appointment.findByIdAndDelete(appointmentId);
        res.redirect('/student/bookings');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error cancelling appointment');
    }
}
async function createreport(req,res){
const reportcontent =req.body.content
const token = req.cookies?.Uid2;
const userdetails = req.cookies?.userdetails;

let createdy;
if (userdetails) {
    const { gmail } = JSON.parse(userdetails);
    createdy = gmail;
} else {
    const decodedToken = jwt.verify(token, "druva123");
    createdy = decodedToken.gmail;
}
let date = new Date()
await reportdb.create({
report:reportcontent,createdby:createdy,createdon:date
})
res.redirect('/student/settings')
}
async function redirectcp(req,res){
    res.render(path.resolve(__dirname,'../views/forgot1.ejs'))
}
async function changepassword(req, res) {
    const { password1, password2 } = req.body;
    if (password1 === password2) {
        try {
              const userDetailsCookie = req.cookies?.userdetails;
            let emailaddress;
            const { gmail } = JSON.parse(userDetailsCookie);
            emailaddress = gmail
             console.log(emailaddress)
            const user = await User.findOne({ gmail: emailaddress });
            if (!user) {
                return res.status(404).send('User not found');
            }
            user.password = password1;
            await user.save();
            res.clearCookie('Uid1', { httpOnly: true });
            res.clearCookie('Uid2', { httpOnly: true });
            res.clearCookie('userdetails', { httpOnly: true });
            return res.redirect("/student/login");
        } catch (error) {
            console.error('Error updating password:', error);
            return res.status(500).send('Internal Server Error');
        }
    } else {
        return res.status(400).send('Passwords do not match');
    }
    
}
async function redirctforgetp(req,res){
    res.render(path.resolve(__dirname,'../views/forgot.ejs'))
}
function generateOTP(){
    return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
}
async function sendOTP(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hexart637@gmail.com',
                pass: 'ovss zdzg ktkf rptu'
            }
        });
        const mailOptions = {
            from: 'hexart637@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
async function requestotp(req, res) {
    const { email } = req.body;
    let gmail1 = email
    let carray = gmail1.split('@')[1]
    if(carray!='iiits.in'){
        return res.send('please use IIITs Email')
}
    console.log(email)
    try {
        const user = await User.findOne({ gmail: email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const otp = generateOTP();
        user.otp = otp;
        await user.save();
        await sendOTP(email, otp);
        res.render(path.resolve(__dirname,'../views/student/verfiyotp.ejs'))
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send('Failed to send OTP');
    }
}
async function verifyotp(req,res){
    const { email, otp } = req.body;
    let gmail1 = email
    let carray = gmail1.split('@')[1]
    if(carray!='iiits.in'){
        return res.send('please use IIITs Email')
}
    const user = await User.findOne({ gmail: email });
    console.log(user.otp)
    console.log(otp)
    if (!user || !user.otp || user.otp !== otp) {
        return res.status(401).send('Invalid OTP');
    }
    user.otp = null;
   res.cookie('userdetails',JSON.stringify({"gmail":email}))
   res.redirect('/changepassword')
}

module.exports={
    renderdstudentlogin,getstudenthome,poststudenthome,poststudenthome1,getstudentschedule,getstudentappoinment,getstudentstudentbookings,getstudentsettings,
    poststudentappointment,studentcancel,studentcancel1,createreport,redirectcp,changepassword,redirctforgetp,requestotp,verifyotp}
