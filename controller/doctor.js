const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const path = require('path')
const User = require('../model/user')
const Doctor = require('../model/doctor')
const appointment = require('../model/appointments')
const accappointment = require('../model/acceptedappointments');
const prescription = require('../model/medication')
const Leave = require('../model/leave')
const reportdb = require('../model/report')
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const mongoose = require('mongoose');
const Prescription = require('../model/medication');
async function renderdoctorlogin(req,res){
    res.render(path.resolve(__dirname,'../views/doctor/login.ejs'));
}
async function postdoctorhome(req,res){
    try {
        let createdy
        const { email, password1, checkbox } = req.body;
        const specificUser = await Doctor.findOne({ gmail: email, password: password1 });
        if (!specificUser) {
            console.log('No user found');
            return res.render(path.resolve(__dirname,'../views/doctor/login.ejs'));
        }
        if (checkbox) {
            const token = jwt.sign({
              gmail: specificUser.gmail,
                password: specificUser.password
            }, "druva123");
            createdy=specificUser.gmail
            res.cookie("Uid1", token,{maxAge: 24 * 60 * 60 * 1000});
        }
        res.cookie("userdetails", JSON.stringify({
        
            gmail: specificUser.gmail,
        }));
       createdy=specificUser.gmail
       
       const appointments = await accappointment.find({
        date: {
            $gte: new Date(),
        },
    }).sort({ date: 1, time: 1 });
    let gmail1 = createdy
    let carray = gmail1.split('@')[1]
    if(carray!='iiits.in'){
        return res.send('please use IIITs Email')
}
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const today_appointments = await accappointment.find({
        date: {
            $gte: new Date(), 
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
        }
    }).sort({ date: 1, time: 1 });
    
    res.render(path.resolve(__dirname,"../views/doctor/doctor_home.ejs"), { appointments,today_appointments, createdy });
       
       
    
    } catch (error) {
        console.error('Error processing doctor login:', error);
        return res.status(500).send('Internal Server Error');
    }


}
async function postdoctorhome1(req,res){
    const {email,password1,password2}=req.body
    console.log(email+password1+password2)
    let createdy
    let gmail1 = email
    let carray = gmail1.split('@')[1]
    if(carray!='iiits.in'){
        return res.send('please use IIITs Email')
}
    if(password1 == password2){
        await Doctor.create({
            gmail:email,
            password:password1
        })
        res.redirect('/doctor/login')
    }
    else{
        return res.send('passwords ddoesnot match')
    }
}
async function getdoctorhome(req,res){
    const appointments = await accappointment.find({
        date: {
            $gte: new Date(),
        },
    }).sort({ date: 1, time: 1 });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const token = req.cookies?.Uid1;
    const userdetails = req.cookies?.userdetails;
    
    let createdy;
    
    if (userdetails) {
        const { gmail } = JSON.parse(userdetails);
        createdy = gmail;
    } else {
        const decodedToken = jwt.verify(token, "druva123");
        createdy = decodedToken.gmail;
    }
    
    const today_appointments = await accappointment.find({
        date: {
            $gte: new Date(), 
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
        }
    }).sort({ date: 1, time: 1 });
        res.render(path.resolve(__dirname,"../views/doctor/doctor_home.ejs"), { appointments,today_appointments, createdy });

    
}


async function getdoctorschedulesessions(req,res){
    const token = req.cookies?.Uid1;
const userdetails = req.cookies?.userdetails;

let createdy;
if (userdetails) {
    const { gmail } = JSON.parse(userdetails);
    createdy = gmail;
} else {
    const decodedToken = jwt.verify(token, "druva123");
    createdy = decodedToken.gmail;
}
    const appointments = await appointment.find({
        date: {
            $gte: new Date(),
        },
    }).sort({ date: 1, time: 1 });
    res.render(path.resolve(__dirname,'../views/doctor/Doctor_SS.ejs') ,{appointments,createdy})
}
async function getdoctorschedule(req,res){
    const token = req.cookies?.Uid1;
const userdetails = req.cookies?.userdetails;

let createdy;
if (userdetails) {
    const { gmail } = JSON.parse(userdetails);
    createdy = gmail;
} else {
    const decodedToken = jwt.verify(token, "druva123");
    createdy = decodedToken.gmail;
}
    const appointments = await accappointment.find({
        date: {
            $gte: new Date(),
        },
    }).sort({ date: 1, time: 1 });
    res.render(path.resolve(__dirname,'../views/doctor/doctor_schedule.ejs'),{appointments,createdy})
}
async function getdoctorsettings(req,res){
    const token = req.cookies?.Uid1;
const userdetails = req.cookies?.userdetails;

let createdy;
if (userdetails) {
    const { gmail } = JSON.parse(userdetails);
    createdy = gmail;
} else {
    const decodedToken = jwt.verify(token, "druva123");
    createdy = decodedToken.gmail;
}
    res.render(path.resolve(__dirname,'../views/doctor/doctor_settings.ejs'),{createdy})
}
async function getdoctorpatients(req,res){
    const token = req.cookies?.Uid1;
const userdetails = req.cookies?.userdetails;

let createdy;
if (userdetails) {
    const { gmail } = JSON.parse(userdetails);
    createdy = gmail;
} else {
    const decodedToken = jwt.verify(token, "druva123");
    createdy = decodedToken.gmail;
}
    const today = new Date();
const appointments = await accappointment.aggregate([
    { $match: { date: { $lt: today } } },
    { $sort: { created: -1 } },
    {
        $group: {
            _id: "$createdy",
            latestAppointment: { $first: "$$ROOT" }
        }
    },
    { $replaceRoot: { newRoot: "$latestAppointment" } }
]);

    res.render(path.resolve(__dirname,"../views/doctor/patients.ejs"),{appointments,createdy})
}
async function postdocotorcancel(req,res){
    const id = req.body.id
    await accappointment.findByIdAndDelete(id)
    res.redirect('/doctor/schedule')
}
async function accpectorreject(req,res){
    const action = req.body.action;
    const id = req.body.hidbut;
    try {
        if (action === "accept") {
            const appointmentToAccept = await appointment.findById(id);
            if (!appointmentToAccept) {
                return res.status(404).send('Appointment not found');
            }
            const acceptedAppointment = await accappointment.create({
                date: appointmentToAccept.date,
                time: appointmentToAccept.time,
                description: appointmentToAccept.description,
                createdy: appointmentToAccept.createdy,
                created: appointmentToAccept.created
            });
            const deletedAppointment = await appointment.findByIdAndDelete(id);
            if (!deletedAppointment) {
                return res.status(404).send('Appointment not found');
            }
            res.redirect("/doctor/schedule_sessions")
            res.send('Appointment accepted successfully.');
        } else {
            const deletedAppointment = await appointment.findByIdAndDelete(id);
            if (!deletedAppointment) {
                return res.status(404).send('Appointment not found');
            }
            res.redirect("/doctor/schedule_sessions")
        }
        res.redirect("/doctor/schedule_sessions")
    } catch (error) {
        console.error('Error:', error);
        
    }

}
async function redirectforget(req,res){
    res.render(path.resolve(__dirname,'../views/forgot2.ejs'))
}
async function changepassword1(req, res) {
    const { password1, password2 } = req.body;
    if (password1 === password2) {
        let createdy;
        try {
            const userDetailsCookie = req.cookies?.userdetails;
          let emailaddress;
          const { gmail } = JSON.parse(userDetailsCookie);
          emailaddress = gmail
           console.log(emailaddress)
          const user = await Doctor.findOne({ gmail: emailaddress });
          if (!user) {
              return res.status(404).send('User not found');
          }
          user.password = password1;
          await user.save();
          res.clearCookie('Uid1', { httpOnly: true });
          res.clearCookie('Uid2', { httpOnly: true });
          res.clearCookie('userdetails', { httpOnly: true });
          return res.redirect("/doctor/login");
        } catch (error) {
            console.error('Error updating password:', error);
            return res.status(500).send('Internal Server Error');
        }
    } else {
        return res.status(400).send('Passwords do not match');
    }
}
async function deletecookies(req,res){
    res.clearCookie('Uid1',{httpOnly:true})
     res.clearCookie('Uid2',{httpOnly:true})
    res.clearCookie('userdetails',{httpOnly:true})
    res.redirect("/")
}
async function createreport1(req,res){
    const reportcontent =req.body.content
    const token = req.cookies?.Uid1;
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
    res.redirect('/doctor/settings')
    }

    async function redirectforgetdocotr(req,res){
        res.render(path.resolve(__dirname,'../views/doctorforget.ejs'))
    }

    function generateOTP() {
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
    async function requestotp1(req, res) {
        const { email } = req.body;
        console.log(email)
        let gmail1 = email
        let carray = gmail1.split('@')[1]
        if(carray!='iiits.in'){
            return res.send('please use IIITs Email')
    }
        try {
            const user = await Doctor.findOne({ gmail: email });
            if (!user) {
                return res.status(404).send('User not found');
            }
            const otp = generateOTP();
            user.otp = otp;
            await user.save();
            await sendOTP(email, otp);
            res.render(path.resolve(__dirname,'../views/doctor/verfiyotp.ejs'))
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).send('Failed to send OTP');
        }
    }
    async function verifyotpdoctor(req,res){
        const { email, otp } = req.body;
        let gmail1 = email
        let carray = gmail1.split('@')[1]
        if(carray!='iiits.in'){
            return res.send('please use IIITs Email')
    }
        const user = await Doctor.findOne({ gmail: email });
        console.log(user.otp)
        console.log(otp)
        if (!user || !user.otp || user.otp !== otp) {
            return res.status(401).send('Invalid OTP');
        }
        user.otp = null;
       res.cookie('userdetails',JSON.stringify({"gmail":email}))
       res.redirect('/changepassword1')
    }
    async function createprescription(req, res) {
        const { startDate, endDate, createdby, sno1, sno2, medicine1, medicine2, timings1, timings2, bookedon } = req.body;
    
        try {
            const trimmedBookedOn = bookedon.trim();
            const today = new Date();
            await Prescription.create({
                createdfor: createdby,
                sno1,
                sno2,
                medication1: medicine1,
                medication2: medicine2,
                timings1,
                timings2,
                createdon: today,
                bookedon: trimmedBookedOn 
            });
    
            res.redirect('/doctor/patients');
        } catch (error) {
            console.error('Error creating prescription:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    
    
    
    
    
    
module.exports={renderdoctorlogin,getdoctorhome,changepassword1,
postdoctorhome1,postdoctorhome,getdoctorschedulesessions,getdoctorschedule,getdoctorsettings,getdoctorpatients,postdocotorcancel,accpectorreject,deletecookies,createreport1,redirectforget,redirectforgetdocotr,requestotp1,verifyotpdoctor,createprescription
}