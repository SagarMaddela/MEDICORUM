const Admin = require('../model/admin')
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
async function admin_login(req, res) {
    res.render(path.resolve(__dirname, '../views/admin/adminlogin.ejs'))
}


/*
async function postadminpatients(req, res) {
    try {
        const { email, password1, checkbox } = req.body;
        const specificUser = await Admin.find({ gmail: email, password: password1 });
        console.log(password1 + email)
        if (!specificUser) {
            console.log('No user found');
            return res.render(path.resolve(__dirname, '../views/admin/adminlogin.ejs'));
        }

        // if (checkbox) {
        //     const token = jwt.sign({
        //         gmail: specificUser.gmail,
        //         password: specificUser.password
        //     }, "druva123");

        //     res.cookie("Uid3", token, { maxAge: 24 * 60 * 60 * 1000 });
        // }

        // res.cookie("userdetails", JSON.stringify({
        //     gmail: specificUser.gmail,
        // }));

        const today = new Date();
        // const appointments = await accappointment.aggregate([
        //     { $match: { date: { $lt: today } } },
        //     { $sort: { created: -1 } },
        //     {
        //         $group: {
        //             _id: "$createdy",
        //             latestAppointment: { $first: "$$ROOT" }
        //         }
        //     },
        //     { $replaceRoot: { newRoot: "$latestAppointment" } }
        // ]);

        res.render(path.resolve(__dirname, "../views/admin/admin_patients.ejs"));

    } catch (error) {
        console.error('Error processing admin login:', error);
        return res.status(500).send('Internal Server Error');
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const token = req.cookies?.Uid1;

        const userdetails = req.cookies?.userdetails;
        let createdy;

        if (userdetails) {
            const { gmail } = JSON.parse(userdetails);
            createdy = gmail;
        } else if (token) {
            try {
                const decodedToken = jwt.verify(token, "druva123");
                createdy = decodedToken.gmail;
            } catch (error) {
                console.error('Error verifying JWT token:', error);
                return res.status(401).send('Unauthorized');
            }
        } else {
            console.log('Token not provided');
            return res.status(401).send('Unauthorized');
        }

        const today_appointments = await appointment.find({
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        }).sort({ date: 1, time: 1 });

        return res.render(path.resolve(__dirname, '../views/doctor/doctor_home.ejs'), { appointments, today_appointments, createdy }); 
    } catch (error) {
        console.error('Error processing doctor login:', error);
        return res.status(500).send('Internal Server Error');
    }
}
*/

async function postadminpatients(req, res) {
    try {
        const { email, password1, checkbox } = req.body;
        console.log(email + password1);
        
        // Use findOne to find a single document
        const user = await Admin.findOne({ email: email, password1: password1 });

        // Check if user exists and password matches
        if (!user || user.password1 !== password1) {
            console.log('Invalid email or password');
            return res.render(path.resolve(__dirname, '../views/admin/adminlogin.ejs'));
        }
        
        // Fetch user details
        const patients = await User.find({});
        
        // If credentials are correct, render admin_patients page
        res.render(path.resolve(__dirname, '../views/admin/admin_patients.ejs'), { patients: patients });

    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}
 async function deleteadminpatients(req,res){
    try{
     const {userId}=req.body;
     const mm=await User.deleteOne({_id:userId});
     const patients = await User.find({});
        
        // If credentials are correct, render admin_patients page
        res.render(path.resolve(__dirname, '../views/admin/admin_patients.ejs'), { patients: patients });
    }catch(err){
        console.log(err);
    }

 }
 async function deletedoctors(req,res){
    try{
     const {userId}=req.body;
     const mm=await Doctor.deleteOne({_id:userId});
     const doctors = await Doctor.find({});
        
        // If credentials are correct, render admin_patients page
        res.render(path.resolve(__dirname, '../views/admin/admin_doctor.ejs'), { doctors: doctors });
    }catch(err){
        console.log(err);
    }

 }
 async function addin(req,res){
    try{
        res.render(path.resolve(__dirname, '../views/student/signup2.ejs'));
    }catch(err){
      console.log(err);
    }
 }
 async function addindoctor(req,res){
    try{
        res.render(path.resolve(__dirname, '../views/doctor/signup2.ejs'));
    }catch(err){
      console.log(err);
    }
 }

async function adminview(req,res){
    try{
        const {email,password1,password2}=req.body
    console.log(email+password1+password2)
    if(password1 == password2){
        const newuser=await User.create({
            gmail:email,
            password:password1
        })
        newuser.save();

    }
        const patients = await User.find({});
        
        // If credentials are correct, render admin_patients page
        res.render(path.resolve(__dirname, '../views/admin/admin_patients.ejs'), { patients: patients });
    }catch(err){

    }
}

async function admindoctorview(req,res){
    try{
        const {email,password1,password2}=req.body
    console.log(email+password1+password2)
    if(password1 == password2){
        const newdoctor=await Doctor.create({
            gmail:email,
            password:password1
        })
        newdoctor.save();

    }
        const doctors = await Doctor.find({});
        
        // If credentials are correct, render admin_patients page
        res.render(path.resolve(__dirname, '../views/admin/admin_doctor.ejs'), { doctors: doctors });
    }catch(err){

    }
}
async function adminpatients(req,res){
    const patients = await User.find({});
        
    // If credentials are correct, render admin_patients page
    res.render(path.resolve(__dirname, '../views/admin/admin_patients.ejs'), { patients: patients });  
}
async function admindoctor(req,res){
    const doctors = await Doctor.find({});
   if(!doctors){
    console.log('no doctors')
   }
   console.log(doctors)
    // If credentials are correct, render admin_patients page
    res.render(path.resolve(__dirname, '../views/admin/admin_doctor.ejs'), { doctors: doctors });  
}
async function adminreport(req,res){
    const reports = await reportdb.find({});
   if(!reports){
    console.log('no doctors')
   }
   console.log(reports)
    // If credentials are correct, render admin_patients page
    res.render(path.resolve(__dirname, '../views/admin/admin_report.ejs'), { reports: reports });  
}


async function getadminpatients(req, res) {
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

    res.render(path.resolve(__dirname, "../views/admin/admin_patients.ejs"), { appointments, today_appointments, createdy });

}
// async function postadminpatients(req, res) {
//     try {
//         const { username, password } = req.body;
//         const specificUser = await Admin.find({ username, password });
        
//         if (!specificUser) {
//             console.log('Invalid username or password');
//             return res.render(path.resolve(__dirname, '../views/admin/adminlogin.ejs'), { error: 'Invalid username or password' });
//         }

//         // Assuming specificUser contains the necessary information for authentication
//         // Redirect to admin_patients page upon successful login
//         return res.redirect('admin/admin_patients');

//     } catch (error) {
//         console.error('Error processing admin login:', error);
//         return res.status(500).send('Internal Server Error');
//     }
// }



module.exports = { admin_login,postadminpatients,  getadminpatients,deleteadminpatients,addin,adminview,adminpatients,admindoctor,deletedoctors,addindoctor,admindoctorview,adminreport }