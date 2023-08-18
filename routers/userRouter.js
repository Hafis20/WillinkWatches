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


// Load the login page for user

userRouter.get("/",userController.loadLogin);
userRouter.get("/login",userController.loadLogin);
userRouter.post("/login",userController.verifyUser);

// Load register page
userRouter.get("/register",auth.isLogout,userController.loadRegister);

// Register post
userRouter.post("/register",userController.insertUser);

// otp verification
userRouter.get('/verifyotp',userController.loadVerfiyOTP);
userRouter.post('/verifyotp',userController.verifyotp);

// Load home page for user
userRouter.get("/home",auth.isLogin,userController.loadHome);

userRouter.get('/logout',userController.logoutUser);

module.exports = userRouter;
