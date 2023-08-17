const User = require('../models/userModel');
const pass = require('../helpers/securePass')

// Load admin Login page
const loadLogin = async(req,res)=>{
   res.render('admin-login');
}

// Verify this is original admin or not 
// Inputs are email and password from the form

const verifyAdmin = async(req,res)=>{
   try {
      const {email,password} = req.body;
      const adminData = await User.findOne({email:email});
      if(adminData){
         const isMatch = await pass.checkPassword(password,adminData.password);
         if(isMatch){
            if(adminData.is_admin === true){
               req.session.admin = adminData;
               res.redirect('/admin/dashboard');
            }else{
               res.render('admin-login',{message:'Invalid Admin'});
            }
         }else{
            res.render('admin-login',{message:'Incorrect email or password'});
         }
      }else{
         res.render('admin-login',{message:'Incorrect email or password'});
      }
   } catch (error) {
      console.log(error.message);
   }
}

const loadDashboard = async(req,res)=>{
   res.render('adminDashboard');
}

const logoutAdmin = async(req,res)=>{
   try {
      req.session.admin = null;
      res.redirect('/admin/login');
   } catch (error) {
      console.log(error.message);
   }
}

module.exports = {
   loadLogin,
   verifyAdmin,
   loadDashboard,
   logoutAdmin,
}