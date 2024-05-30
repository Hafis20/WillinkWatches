const mongoose = require('mongoose');
const User = require('../models/userModel'); // Require for User Schemama
const pass = require('../helpers/securePass'); // Require for password hashing
const otpGenerate = require('../helpers/otpGenerate');
const Product = require('../models/productModel');
const Order = require('../models/ordersModel');
const Category = require('../models/categoryModel');
const Address = require('../models/addressModel');
const Wallet = require('../models/walletModel');
const RazorPayHelper = require('../helpers/razorpayHelper');
const CartCountHelper = require('../helpers/cartItemsCount');
const nodemailer = require('nodemailer');
const Banner = require('../models/bannerModel');

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
         const userInfo = await user.save(); // if the otp is correct we save the data into data base
         if(userInfo){
            req.session.user = user;
            res.json({status:'success',message:'OTP Verified Please Login'});
         }
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
         console.log(isMatch)
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


// ===================Forget Password ===========
// Loading the forget password page
const loadForgetPass = async(req,res)=>{
   try {
      res.render('forget-email')
   } catch (error) {
      console.log(error.message);
   }
}

// Getting the email and make otp
const forgetPassEmail = async(req,res)=>{
   try {
      const {email} = req.body;
      
      // Node mailer set up

      const userId = await User.findOne({email:email},{_id:1});
      if(userId){
         req.session.forgotUserId = userId
         function generateOtp(){
            return Math.floor(100000 + Math.random() * 900000).toString();
         }
   
         const otp = generateOtp();
   
   
         let transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
               user: process.env.EMAIL,
               pass: process.env.PASS
            }
         });
   
         const mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'OTP for Verification',
            text: `Your OTP is: ${otp}`
         };
   
         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            return console.log(error);
            }
            if(info.response){
               req.session.otp = otp;
               res.render('forgot-otp-verification');
            }
         });
   
      }else{
         res.render('forget-email',{message:'Incorrect Email Please Sign Up'})
      }
      
      
   } catch (error) {
      res.json({status:'error',message:'Something wrong'});
      console.log(error.message);
   }
}

// Verify forgetPassOtp 
const verifyForgotOtp = async(req,res)=>{
   try {
      const userOtp = req.body.otp;
      // console.log(userOtp)
      const originalOtp = req.session.otp

      if(userOtp === originalOtp){
         req.session.otp = null;
         res.render('set-new-password');
      }else{
        res.render('forgot-otp-verification',{message:'Incorrect OTP'});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Setting the new password
const setNewPassword = async(req,res)=>{
   try {
      const newPassword = req.body.newPass;
      const userId = req.session.forgotUserId;

      const hashedPass = await pass.securePassword(newPassword);
      
      const user = await User.findByIdAndUpdate(userId,
         {$set:{
            password:hashedPass
         }},
         {new:true});

      if(user){
         res.json({status:'success',message:'Password Changed'});
         // console.log('Getting from setNew Pass :',user);
      }
   } catch (error) {
      res.json({status:'error',message:'Server side issue'});
      console.log(error.message);
   }
}


//======================Forgot password operation end=================

//Rendering the home page
const loadHome = async(req,res)=>{
   try {
      const productData = await Product.find({is_listed:true}).populate('category').sort({date:-1}).limit(4);
      const banners = await Banner.find({isListed:true});
      // console.log(banners);
      if(productData){
         const availableProducts = productData.filter(products=>products.category.is_listed === true);
         // console.log(availableProducts)

         if(req.session && req.session.user && req.session.user._id){
            const cartItemsCount = await CartCountHelper.findCartItemsCount(req.session.user._id);
            // console.log(cartItemsCount)
            // If exists I pass cartItemsCount also
            res.render('home',{products : availableProducts,banners,cartItemsCount});
         }else{
            res.render('home',{products : availableProducts,banners});

         }
      }
   } catch (error) {
      console.log(error.message)
   }
}

// =============================Product showing page===========================

// Load Single Product
const loadSingleProduct = async(req,res)=>{
   try {
      const id = req.query.id;
      const productData = await Product.findById(id).populate('category');
      console.log(productData)
      if(productData){
         if(req.session && req.session.user && req.session.user._id){
            // Finding the total amount in the cart
            const cartItemsCount = await CartCountHelper.findCartItemsCount(req.session.user._id);
            res.render('single-product',{product:productData,cartItemsCount});

         }else{
            res.render('single-product',{product:productData});
         }
      }
   } catch (error) {
      console.log(error.message)
   }
}

// Show all products

const loadAllProducts = async(req,res)=>{
   try {
      const productData = await Product.find({is_listed:true}).populate('category');

      const availableProducts = productData.filter((product)=>product.category.is_listed === true);
      // console.log(availableProducts);
      const categories = await Category.find();

      // Finding the user is logined or not
      if(req.session && req.session.user && req.session.user._id){
         const cartItemsCount = await CartCountHelper.findCartItemsCount(req.session.user._id);
         // console.log(cartItemsCount)
         // If exists I pass cartItemsCount also
         res.render('all-products',{products:availableProducts,categories,cartItemsCount});
      }else{
         res.render('all-products',{products:availableProducts,categories});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Filter Product using category

const filterProducts = async(req,res)=>{
   try {
      const id = req.query.id;
      // Taking the whole category for passing to next page
      const categories = await Category.find();
      // Finding which category we want 
      const category = await Category.findById(id);

      const products = await Product.find({category:category._id, is_listed:true}).populate('category');

      // Taking the avalable products in the shop after checking listed or unlisted
      const availableProducts = products.filter((products)=>products.category.is_listed === true);
      res.render('all-products',{products:availableProducts,categories});
   } catch (error) {
      console.log(error.message);
   }
}

// Search Products using name

const searchProducts = async(req,res)=>{
   try {
      const regex = req.body.regex
      const products = await Product.find({productName:{$regex:regex,$options:'i'}});
      const categories = await Category.find();
      res.render('all-products',{products,categories})
   } catch (error) {
      console.log(error.message);
   }
}

// Sorting price wise
const priceWiseSort = async(req,res)=>{
   try {
      // For next page categories
      const categories = await Category.find();
      let productData;
      if(req.query.from === '1'){ // It means that low to high
          productData = await Product.find({is_listed:true}).populate('category').sort({salePrice:1});
      }else{  // It means high to low
          productData = await Product.find({is_listed:true}).populate('category').sort({salePrice:-1});
      }
      
      const availableProducts = productData.filter((product)=>product.category.is_listed === true);
      res.render('all-products',{products:availableProducts,categories})
   } catch (error) {
      console.log(error.message);
   }
}


// User Profile
const userProfile = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      // console.log(user_id);
      const userData = await User.findById(user_id);
      const cartItemsCount = await CartCountHelper.findCartItemsCount(user_id);
      res.render('user-profile',{userData,cartItemsCount});
   } catch (error) {
      console.log(error.message);
   }
}

// ===============================ADDRESS=========================

// Adding address 

const addingAddress = async(req,res)=>{
   try {
      const {name,mobile,homeAddress,city,street,postalCode} = req.body;
      // console.log(name)
      // console.log(mobile)
      // console.log(homeAddress)
      // console.log(city)
      // console.log(street)
      // console.log(postalCode)

      let newAddress ={
         name:name,
         mobile:mobile,
         homeAddress:homeAddress,
         city:city,
         street:street,
         postalCode:postalCode,
         isDefault:false,
      }
      const user_id  = req.session.user._id;
      let userAddress = await Address.findOne({userId:user_id});

      if(!userAddress){
         newAddress.isDefault = true;
         userAddress = new Address({userId:user_id,address:[newAddress]});
      }else{
         userAddress.address.push(newAddress);

         if(userAddress.address.length === 1){
            userAddress.address[0].isDefault = true;
         }
      }
       
      await userAddress.save();
      // console.log(userAddress);
      res.json({status:'success'});
   } catch (error) {
      console.log(error.message);
      res.json({status:'error'});
   }
}

// Managing User address

const loadManageAddress = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      let userAddress = await Address.findOne({userId:user_id});

      if(!userAddress){
         userAddress = new Address({userId:user_id,address:[]});
         await userAddress.save();
      }
      // console.log(userAddress)
      const cartItemsCount = await CartCountHelper.findCartItemsCount(user_id);
      res.render('manage-address',{address:userAddress.address,cartItemsCount});
   } catch (error) {
      console.log(error.message);
   }
}


//Load the Edit User address page
const loadEditAddress = async(req,res)=>{
   try{
      const user_id = req.session.user._id;
      const addressId = req.query.addressId;
      const user = await Address.findOne({userId:user_id});
      // console.log(userAddress)
      
      const userAddress = user.address.find((address)=>{
         return address._id.toString() === addressId;
      })
      // console.log(userAddress);
      const cartItemsCount = await CartCountHelper.findCartItemsCount(user_id);
      res.render('edit-address',{userAddress,cartItemsCount});
   }catch(error){
      console.log(error.message);
   }
}

// Edit address

const editAddress = async(req,res)=>{
   try {
      const {name,mobile,homeAddress,city,street,postalCode,addressId} = req.body
      
      const user_id = req.session.user._id;
      const updatedAddress = await Address.findOneAndUpdate({userId:user_id,'address._id':addressId},
      {$set:{
         'address.$.name':name,
         'address.$.mobile':mobile,
         'address.$.homeAddress':homeAddress,
         'address.$.city':city,
         'address.$.street':street,
         'address.$.postalCode':postalCode,
      }},
      {new:true});
      
      // console.log(updatedAddress)
      res.json({status:'success',message:'Address Edited'});
   } catch (error) {
      res.json({status:'error',message:'Something went wrong'});
      console.log(error.message);
   }
}

// Delete the user address 
const deleteAddress = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      const addressId = req.query.addressId;
      // console.log(req.query.addressId);
      const address = await Address.findOne({userId:user_id});

      const deletedAddress = address.address.find(address=>address._id.toString() === addressId);
      // console.log(deletedAddress);

      const isDefaultedAddress = deletedAddress.isDefault;
      // console.log(isDefaultedAddress);

      // Remove the address
      address.address = address.address.filter((addr)=>addr._id.toString() !== addressId);
      // console.log(address.address);
      console.log(address.address.length)
      if(isDefaultedAddress && address.address.length > 0){
         let newDefaultAddress = address.address.find(addr=>addr._id.toString() !== addressId);
         if(newDefaultAddress){
            newDefaultAddress.isDefault = true;
         }
         // console.log(newDefaultAddress)
      }
      // console.log(address);
      await address.save();
      res.json({status:'success',message:'Address Removed'});
   } catch (error) {
      res.json({status:'success',message:'Something went wrong'});
      console.log(error.message);
   }
}

// ====================User profile Management ======

// Edit user profile 

const EditProfile = async(req,res)=>{
   try {
      const {firstName,lastName,email,mobile,userId} = req.body;
      const usersData = await User.find();

     // Find other Users and find is the email already exist or not

      const anotherUser = usersData.filter(user=>user._id.toString() !== userId);
      const emailExists = anotherUser.filter(user=>user.email === email);
      const mobileExist = anotherUser.filter(user=>user.mobile.toString() === mobile);
      
      if(emailExists.length && mobileExist.length){
         res.json({status:'error',message:'Email and Mobile Number Already Exists'});
      }else if(emailExists.length){
         res.json({status:'error',message:'Email Already Exists'});
      }else if(mobileExist.length){
         res.json({status:'error',message:'Mobile Number Already Exists'});
      }else{
         const user = await User.findByIdAndUpdate(userId,
            {$set:{
               firstName:firstName,
               lastName:lastName,
               email:email,
               mobile:mobile
            }},
            {new:true});
         res.json({status:'success',message:'Profile Edited'});
      }
   } catch (error) {
      console.log(error.message);
      res.json({status:'error',message:'Something went Wrong'});
   }
}

// Change user password

const changePassword = async(req,res)=>{
   try {
       const {currentPassword , newPassword} = req.body
      //  console.log('User current password :',currentPassword);
      //  console.log('User new Password',newPassword);

       const user_id = req.session.user._id;
       const user = await User.findById(user_id)
      
       const isMatch = await pass.checkPassword(currentPassword,user.password);
       if(isMatch){
         const hashedPass = await pass.securePassword(newPassword);
         user.password = hashedPass;
         await user.save();
         res.json({status:'success',message:'Password changed'});
       }else{
         res.json({status:'error',message:'Current Password is Incorrect'});
       }
   } catch (error) {
      console.log(error.message);
   }
}

//------------------------------------Wallet management-----------------

// Load the wallet page
const loadWallet = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      // Taking the wallet details from db
      let userWallet = await Wallet.findOne({userId:user_id});
      if(!userWallet){
         userWallet = new Wallet({userId:user_id});
         await userWallet.save();
      }
      const cartItemsCount = await CartCountHelper.findCartItemsCount(user_id);
      res.render('view-wallet',{userWallet,cartItemsCount});
   } catch (error) {
      console.log(error.message);
   }
}

// Recharge the wallet
const rechargeWallet  = async(req,res)=>{
   try{
      let {amount} = (req.body);
      amount = Number(amount);
      const orderId = ""+Date.now();

      RazorPayHelper.generateRazorPay(orderId,amount).then((response)=>{
         res.json({status:'RAZORPAY',response})
      })
      
   }catch(error){
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
   //--Forget pass--
   loadForgetPass,
   forgetPassEmail,
   verifyForgotOtp,
   setNewPassword,
   // --Products--
   loadAllProducts,
   filterProducts,
   searchProducts,
   priceWiseSort,
   userProfile,
   //-- Address --
   addingAddress,
   loadManageAddress,
   loadEditAddress,
   editAddress,
   deleteAddress,
   // --profile--
   EditProfile,
   changePassword,
   //---Wallet---
   loadWallet,
   rechargeWallet,
   //==Otp====
   loadVerfiyOTP,
   verifyotp,
   verifyUser,
   //==Logout==
   logoutUser
}