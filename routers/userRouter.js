const express = require("express");
const userRouter = express();

//Session
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
   uri:process.env.MONGO_URL,
   collection:'mySession'
})

userRouter.use(session({
   secret:process.env.SECRET_ID,
   resave:false,
   saveUninitialized:false,
   store:store,
}))

// User Controller 

const userController = require("../controllers/userController");

// Static
userRouter.use(express.static('public'))

userRouter.set("view engine", "ejs");
userRouter.set("views", "./views/user");
userRouter.use(express.json())
userRouter.use(express.urlencoded({extended:true}))

// Load register page
userRouter.get("/", userController.loadRegister);
userRouter.get("/register",userController.loadRegister);

// Register post
userRouter.post("/",userController.insertUser);
userRouter.post("/register",userController.insertUser);

// otp verification
userRouter.get('/verifyotp',userController.loadVerfiyOTP);
userRouter.post('/verifyotp',userController.verifyotp);

// Load the login page for user

userRouter.get("/login",userController.loadLogin);
// userRouter.post("/login",userController.verifyUser);

// Load home page for user
userRouter.get("/home",userController.loadHome);


module.exports = userRouter;
