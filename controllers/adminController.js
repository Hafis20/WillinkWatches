const User = require('../models/userModel'); 
const pass = require('../helpers/securePass');


// Load admin Login page
const loadLogin = async(req,res)=>{
   try {
      res.render('admin-login');
   } catch (error) {
      console.log(error.message);
   }
}

// Verify this is original admin or not 
// Inputs are email and password from the form

const verifyAdmin = async(req,res)=>{
   try {
      const {email,password} = req.body;
      const adminData = await User.findOne({email:email}); // Checking if data is available in database
      if(adminData){
         const isMatch = await pass.checkPassword(password,adminData.password); // if available then we check the password is correct
         if(isMatch){
            if(adminData.is_admin === true){ // if correct then we check it is user or admin
               req.session.admin = adminData;
               res.json({status:'success',message:'Login successfull'}) // if admin redirecting the page
            }else{
               res.json({status:'error',message:'Invalid admin'});;
            }
         }else{
            res.json({status:'error',message:'Incorrect email or password'});
         }
      }else{
         res.json({status:'error',message:'Incorrect email or password'});
      }
   } catch (error) {
      console.log(error.message);
      res.json({status:'error',message:'Server side issue'});
   }
}


// Rendering the admin Dashboard
const loadDashboard = async(req,res)=>{
   try {
   res.render('adminDashboard');
   } catch (error) {
      console.log(error.message);
   }
}
//=================================USERS===================================

//Load users list page 

const loadUsersList = async(req,res)=>{
   try {
      const usersData = await User.find({is_admin:false});
      if(usersData){
         res.render('list-users',{users:usersData});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Load edit Users

const loadEditUsers = async(req,res)=>{
   try {
      const id = req.query.id
      const userData = await User.findById(id);
      if(userData){
         res.render('edit-users',{user:userData});
      }
   } catch (error) {
      console.log(error.message)
   }
}
// Edit users

const editUsers = async(req,res)=>{
   try {
      const {firstName,lastName,id}= req.body;
      if(!firstName){
         res.json({status:'error',message:'First name is required'});
      }
      else if(!lastName){
         res.json({status:'error',message:'Last Name required'})
      }else{
         const usersData = await User.findByIdAndUpdate(id,
            {$set:{
               firstName:firstName,
               lastName:lastName
            }})
            res.json({status:'success',message:'Successfully Updated'})
      }
   } catch (error) {
      console.log(error.message);
      res.json({status:'error',message:'Server side issue'});
   }
}

// Block user
const blockUser = async(req,res)=>{
   try {
      const id = req.query.id;
      const userData = await User.findByIdAndUpdate(id,
         {$set:{
            is_blocked:true
         }})
        res.redirect('/admin/list-users')
   } catch (error) {
      console.log(error.message)
   }
}
// Unblock User
const unBlockUser = async(req,res)=>{
   try {
      const id = req.query.id
      const userData = await User.findByIdAndUpdate(id,
         {$set:{
            is_blocked:false
         }})
         res.redirect('/admin/list-users');
   } catch (error) {
      console.log(error.message);
   }
}


// ======================================ADMIN LOGOUT================================

const logoutAdmin = async(req,res)=>{
   try {
      req.session.admin = null;
      res.redirect('/admin/login');
   } catch (error) {
      console.log(error.message);
   }
}

module.exports = {
   // ====Login=====
   loadLogin,
   verifyAdmin,
   loadDashboard,
   //=====User======
   loadUsersList,
   loadEditUsers,
   editUsers,
   blockUser,
   unBlockUser,
   //======Logout========
   logoutAdmin,
}