const express = require('express')
const {admin_login,postadminpatients,getadminpatients,deleteadminpatients,addin,adminview,adminpatients,admindoctor,deletedoctors,addindoctor,admindoctorview,adminreport} = require('../controller/admin')
const {handlehome,render_a,aboutus}=require('../controller/home')
const {renderdoctorlogin,getdoctorhome,
    postdoctorhome1,postdoctorhome,
    getdoctorschedulesessions,getdoctorschedule,
    getdoctorsettings,verifyotpdoctor,requestotp1,createprescription,getdoctorpatients,postdocotorcancel,accpectorreject,deletecookies,changepassword1,createreport1,redirectforget,redirectforgetdocotr
} = require('../controller/doctor')
const {renderdstudentlogin,getstudenthome,
    poststudenthome,poststudenthome1,
    getstudentschedule,getstudentappoinment,
    getstudentstudentbookings,getstudentsettings,
    poststudentappointment,studentcancel,studentcancel1,createreport,redirectcp,changepassword,redirctforgetp,requestotp,verifyotp}= require('../controller/student')
const router = express.Router()
router.get('/',handlehome);
router.get('/a', render_a);
router.get('/doctor/login',renderdoctorlogin);
router.get('/student/login', renderdstudentlogin);
router.get('/student/home', getstudenthome);
router.post('/doctor/home', postdoctorhome);
router.post('/student/home', poststudenthome);
router.post('/doctor/home1',postdoctorhome1)
router.post('/student/home1',poststudenthome1)
router.get('/student/appointment',getstudentappoinment)
router.get('/student/schedule',getstudentschedule)
router.get('/student/bookings',getstudentstudentbookings)
router.get('/student/settings',getstudentsettings)
router.get('/doctor/home',getdoctorhome)
router.get('/doctor/schedule_sessions',getdoctorschedulesessions)
router.get('/doctor/schedule',getdoctorschedule)
router.get('/doctor/patients',getdoctorpatients)
router.get('/doctor/settings',getdoctorsettings)
router.post('/appointment', poststudentappointment);
router.post('/cancelAppointment', studentcancel);
router.post('/doctorcancel',postdocotorcancel)
router.post('/acceptorreject',accpectorreject)
router.post('/cancelAppointment1',studentcancel1)
router.get('/logout',deletecookies)
router.post('/report',createreport)
router.get('/changepassword',redirectcp)
router.post('/confirmchangepassword',changepassword)
router.get('/aboutus',aboutus)
router.get('/student/forget',redirctforgetp)
router.post('/requestotp',requestotp)
router.post('/confirmchangepassword1',changepassword1)
router.post('/report1',createreport1)
router.get('/changepassword1',redirectforget)
router.post('/verifyotp',verifyotp)
router.get('/doctor/forgetpassword',redirectforgetdocotr)
router.post('/requestotpdoctor1',requestotp1)
router.post('/verifyotpdoctor',verifyotpdoctor)
router.post('/createmedication',createprescription)
router.get('/adminlogin',admin_login)
router.get('/addin',addin)
router.post('/adminview',adminview)
router.post('/admindoctorview',admindoctorview)
router.post('/admin/patients',postadminpatients)
router.post('/deletepatients',deleteadminpatients)
router.post('/deletedoctors',deletedoctors)
router.get('/admin/patients',getadminpatients)
router.get('/adminpatients',adminpatients)
router.get('/admindoctor',admindoctor)
router.get('/addindoctor',addindoctor)
router.get('/adminreport',adminreport)

module.exports=router
