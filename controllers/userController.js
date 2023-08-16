const User = require('../models/userModel'); // Require for User Schemama
const pass = require('../helpers/securePass'); // Require for password hashing
const otpGenerate = require('../helpers/otpGenerate');

// Load the registration  for user when call "/register or /"

const loadRegister = async(req,res)=>{
   console.log(req.session.id)
   res.render('register',{message:''});
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

const loadVerfiyOTP = async(req,res)=>{
   res.render('verifyotp')
}

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
         await user.save();
         res.redirect('/home');
      }else{
         console.log('error')
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
   loadRegister,
   loadHome,
   insertUser,
   loadVerfiyOTP,
   verifyotp
}