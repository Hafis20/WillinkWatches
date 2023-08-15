const User = require('../models/userModel');
const bcrypt = require('bcrypt')

const loadSignup = async(req,res)=>{
   req.session.auth = true;
   console.log(req.session.id)
   res.render('signup',{message:''});
}

const insertUser = async(req,res)=>{
   try {
      const {firstname , lastname , email, password , mobile } = req.body
      const hashPassword = await bcrypt.hash(password,10);
      const user = await User({
         firstName:firstname,
         lastName:lastname,
         email:email,
         password:hashPassword,
         mobile:mobile
      })
      const userData =await user.save();
      if(userData){
         res.render('signup',{message:"Sign Up success Please very your mail"})
      }
   } catch (error) {
      console.log(error.message);
   }
}


const loadLogin = async(req,res)=>{
   res.render('login');
}


const loadHome = async(req,res)=>{
   res.render('home');
}
module.exports = {
   loadLogin,
   loadSignup,
   loadHome,
   insertUser
}