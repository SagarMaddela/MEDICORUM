const path = require('path')
const User = require('../model/user')
const Doctor = require('../model/doctor')
const appointment = require('../model/appointments')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
async function handlehome(req,res){
    try {
        const uid1 = req.cookies.Uid1;
        const uid2 = req.cookies.Uid2;
        if (!uid1 && !uid2) {
            return res.render(path.resolve(__dirname,'../views/index.ejs'));
        }
        try {
            if(uid1){
                const logineddoctor=jwt.verify(uid1,"druva123");
                if(logineddoctor){
                    return res.redirect('/doctor/home');
                }
            }
            if(uid2){
                const logineduser=jwt.verify(uid2,"druva123");
                if (logineduser){
                    return res.redirect('/student/home');
                }
            }
        } catch (error) {
            console.error('Error verifying JWT:', error);
            return res.status(500).send('Internal Server Error');
        }
        return res.render(path.resolve(__dirname,'../views/index.ejs'));
    } catch (error) {
        console.error('Error:',error);
        return res.status(500).send('Internal Server Error');
    }
}
async function render_a(req,res){
    res.render(path.resolve(__dirname,'../views/a.ejs'));
}
async function aboutus(req,res){
    res.render(path.resolve(__dirname,'../views/aboutus.ejs'))
}
module.exports={handlehome,render_a,aboutus}