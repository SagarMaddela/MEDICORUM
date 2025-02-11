const mongoose = require('mongoose');
const adminschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password1: {
        type: String,
        required: true
    },
    otp:{
        type:String,
        requiired:false
    }
});
const Admin = mongoose.model('admin', adminschema);
module.exports= Admin