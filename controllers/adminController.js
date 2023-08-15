const User = require('../models/userModel');


const loadDashboard = async(req,res)=>{
   res.render('index');
}

module.exports = {
   loadDashboard,
}