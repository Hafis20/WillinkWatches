const express = require("express");
const userRouter = express();

//Session
const session = require('express-session')

userRouter.use(session({
   secret:process.env.SECRET_ID,
   resave:false,
   saveUninitialized:false,
}))

// nocache middleware

const nocache = require('nocache');
userRouter.use(nocache());

// User Controller 

const userController = require("../controllers/userController");

// Authentication

const auth = require('../middleware/userAuth')

// Static
userRouter.use(express.static('public'))

userRouter.set("view engine", "ejs");
userRouter.set("views", "./views/user");
userRouter.use(express.json())
userRouter.use(express.urlencoded({extended:true}))

// --------------------------------LOGIN---------------------
// Load the login page for user

userRouter.get("/",auth.isLogout,userController.loadLogin);
userRouter.get("/login",auth.isLogout,userController.loadLogin);
userRouter.post("/login",userController.verifyUser);

// Load register page
userRouter.get("/register",auth.isLogout,userController.loadRegister);

// Register post
userRouter.post("/register",userController.insertUser);

// ---------------------------------------OTP-----------------------

// otp verification
userRouter.get('/verifyotp',auth.isLogout,userController.loadVerfiyOTP);
userRouter.post('/verifyotp',userController.verifyotp);

//--------------------------------------HOME-------------------

// Load home page for user
userRouter.get("/home",userController.loadHome);

// Load single image of a product
userRouter.get('/single-product',auth.isLogin,userController.loadSingleProduct);

// -----------------------------------SHOP---------------------------

// Load all products
userRouter.get('/show-all-products',userController.loadAllProducts);

// Fiter based on category
userRouter.get('/filter-products',userController.filterProducts);

// -------------------------------------LOGOUT---------------------

userRouter.get('/logout',userController.logoutUser);

module.exports = userRouter;
