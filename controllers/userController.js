const User = require('../models/userModel'); // Require for User Schemama
const pass = require('../helpers/securePass'); // Require for password hashing
const otpGenerate = require('../helpers/otpGenerate');

// Load the registration  for user when they call "/register or /"

const loadRegister = async(req,res)=>{
   res.render('register');
}


// Inserting a user "User data contain firstname,lastname,email,password,mobile"
// User signup the form correctly when it works

const insertUser = async(req,res)=>{
   
      const existingEmail = await User.findOne({email:req.body.email});
      const existingMobile = await User.findOne({mobile:req.body.mobile});

      if(existingEmail){
         res.render('register',{message:"Email Already Exists"});
      }
      if(existingMobile){
         res.render('register',{message:"Mobile Number Already Exists"});
      }
   try{
      await otpGenerate.sendVerificationCode(req.body.mobile)
      .then((verification) => {
         req.session.user = req.body;
         // Redirecting the otp page after getting otp
         res.redirect('/verifyotp');
      })
      .catch(error => {
         console.error(error);
         res.status(500).send("Error sending OTP");
      });
   }catch(error){
      console.log(error);
   }
}

// when the user click in register button it will gives a page for entering the otp

const loadVerfiyOTP = async(req,res)=>{
   res.render('verifyotp')
}


// After the user enter the otp we check the otp is correct or not

const verifyotp = async(req,res)=>{
   const otp = req.body.otp;
   try {
      const mobileNumber = req.session.user.mobile;
      const verificationResult = await otpGenerate.verifyOTP(mobileNumber,otp)
      if(verificationResult.status === 'approved'){
         const userData = req.session.user;
         const spassword = await pass.securePassword(userData.password);
         const user = await User.create({
            firstName:userData.firstName,
            lastName:userData.lastName,
            email:userData.email,
            password:spassword,
            mobile:userData.mobile,
         })
         await user.save(); // if the otp is correct we save the data into data base
         res.redirect('/home');
      }else{
         console.log('error')
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Rendering the login page for user

const loadLogin = async(req,res)=>{
   res.render('login');
}
// When the user enter the email and password through login page we check it exists or not
// input is "email","password"
const verifyUser = async(req,res)=>{
   try {
      const {email , password} = req.body;
      const userData = await User.findOne({email:email});
      if(userData){
         const isMatch = await pass.checkPassword(password,userData.password);
         if(isMatch){
            req.session.user = userData;
            res.redirect('/home');
         }else{
            res.render('login',{message:'Email or password is incorrect'})
         }

      }else{
         res.render('login',{message:'Email or password is incorrect'})
      }
   } catch (error) {
      console.log(error.message);
   }
}

//Rendering the home page
const loadHome = async(req,res)=>{
   res.render('home');
}

// User logout 
const logoutUser = async (req,res)=>{
   try {
      req.session.destroy(); // Destroy the session
      res.redirect('/login');
   } catch (error) {
      console.log(error.message)
   }
}
module.exports = {
   loadLogin,
   loadRegister,
   loadHome,
   insertUser,
   loadVerfiyOTP,
   verifyotp,
   verifyUser,
   logoutUser
}