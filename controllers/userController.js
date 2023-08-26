const User = require('../models/userModel'); // Require for User Schemama
const pass = require('../helpers/securePass'); // Require for password hashing
const otpGenerate = require('../helpers/otpGenerate');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// Load the registration  for user when they call "/register or /"

const loadRegister = async(req,res)=>{
   try {
      res.render('register');
   } catch (error) {
      console.log(error.message);
   }
}


// Inserting a user "User data contain firstname,lastname,email,password,mobile"
// User signup the form correctly when it works

const insertUser = async(req,res)=>{
  
   try{
      const existingEmail = await User.findOne({email:req.body.email});
      const existingMobile = await User.findOne({mobile:req.body.mobile});
      if(existingEmail && existingMobile){
         res.json({status:'error',message:'Email and Mobile already Exists'})
      }
      else if(existingEmail){
         res.json({status:'error',message:"Email Already Exists"});
      }
      else if(existingMobile){
         res.json({status:'error',message:"Mobile Number Already Exists"});
      }
      else{
         req.session.tempUser = req.body;
         await otpGenerate.sendVerificationCode(req.body.mobile)
         .then(() => {
            // Redirecting the otp page after getting otp
            res.json({status:'success',message:'Registered Please Enter your OTP'})
         })
         .catch(error => {
            console.error(error);
            res.json({status:'error',message:error.message});
         });
      }
   }catch(error){
      res.json({status:'error',message:'All Feilds are required'})
   }
}

// when the user click in register button it will gives a page for entering the otp

const loadVerfiyOTP = async(req,res)=>{
   try {
      res.render('verifyotp')   
   } catch (error) {
      console.log(error.message)
   }
}


// After the user enter the otp we check the otp is correct or not

const verifyotp = async(req,res)=>{
   const otp = req.body.otp;
   try {
      const mobileNumber = req.session.tempUser.mobile;
      const verificationResult = await otpGenerate.verifyOTP(mobileNumber,otp)
      if(verificationResult.status === 'approved'){
         const userData = req.session.tempUser;
         const spassword = await pass.securePassword(userData.password);
         const user = await User.create({
            firstName:userData.firstName,
            lastName:userData.lastName,
            email:userData.email,
            password:spassword,
            mobile:userData.mobile,
         })
         await user.save(); // if the otp is correct we save the data into data base
         res.json({status:'success',message:'OTP Verified Please Login'});
      }else{
         res.json({status:'error',message:'Please verify your otp'});
      }
   } catch (error) {
      res.json({status:'error',message:'Please verify your otp'});
   }
}

// Rendering the login page for user

const loadLogin = async(req,res)=>{
   try {
      res.render('login');
   } catch (error) {
      console.log(error.message)
   }
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
            if(userData.is_blocked === true){
               res.json({status:'error',message:'You are blocked by user please contact with authority'})
            }else{
               req.session.user = userData;
               res.json({status : "success", message:'login successfull'})
            }
         }else{
            res.json({status : "error", message:'Email or password is incorrect'})
         }
      }else{
         res.json({status : "error", message:'Email or password is incorrect'})
      }
   } catch (error) {
      res.json({status : "error", message: error.message})
   }
}

//Rendering the home page
const loadHome = async(req,res)=>{
   try {
      const productData = await Product.find({is_listed:true}).limit(4);
      if(productData){
         res.render('home',{products : productData});
      }
   } catch (error) {
      console.log(error.message)
   }
}


// Load Single Product
const loadSingleProduct = async(req,res)=>{
   try {
      const id = req.query.id;
      const productData = await Product.findById(id);
      if(productData){
         res.render('single-product',{product:productData});
      }
   } catch (error) {
      console.log(error.message)
   }
}

// Show all products

const loadAllProducts = async(req,res)=>{
   try {
      const productData = await Product.find({is_listed:true});
      const categories = await Category.find();
      res.render('all-products',{products:productData,categories});
   } catch (error) {
      console.log(error.message);
   }
}

const filterProducts = async(req,res)=>{
   try {
      const id = req.query.id;
      const categories = await Category.find();
      const category = await Category.findById(id); // Passing the category of products
      const products = await Product.find({category:category.categoryName, is_listed:true});
      res.render('all-products',{products:products,categories});
   } catch (error) {
      console.log(error.message);
   }
}

// User logout 
const logoutUser = async (req,res)=>{
   try {
      req.session.user = null; // Destroy the session
      res.redirect('/login');
   } catch (error) {
      console.log(error.message)
   }
}
module.exports = {
   loadLogin,
   loadRegister,
   loadHome,
   loadSingleProduct,
   insertUser,
   loadAllProducts,
   filterProducts,
   //==Otp====
   loadVerfiyOTP,
   verifyotp,
   verifyUser,
   //==Logout==
   logoutUser
}