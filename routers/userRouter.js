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

// Cart Controller

const cartController = require('../controllers/cartController');

// Order Controller

const ordersController = require('../controllers/ordersController');
// Authentication

const auth = require('../middleware/userAuth')

// Static
userRouter.use(express.static('public'))

userRouter.set("view engine", "ejs");
userRouter.set("views", "./views/user");
userRouter.use(express.json())
userRouter.use(express.urlencoded({extended:true}))


//--------------------------------------HOME-------------------

// Load home page for user
userRouter.get("/home",userController.loadHome);
userRouter.get("/",userController.loadHome);

// Load single image of a product
userRouter.get('/single-product',userController.loadSingleProduct);

// --------------------------------LOGIN---------------------
// Load the login page for user

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

// -----------------------------------SHOP---------------------------

// Load all products
userRouter.get('/show-all-products',userController.loadAllProducts);

// Fiter based on category
userRouter.get('/filter-products',userController.filterProducts);

// Search products 
userRouter.post('/show-all-products',userController.searchProducts);


// -------------------------------------CART------------------------

// Load cart page
userRouter.get('/cart',auth.isLogin,cartController.loadCart);

// Add to cart
userRouter.get('/add-to-cart',auth.ftisLogin,cartController.addToCart);

// Remove product from cart
userRouter.get('/remove-product',auth.ftisLogin,cartController.removeProduct);

// Incriment the quantity

userRouter.post('/update-quantity',auth.ftisLogin,cartController.updateQuantity);

userRouter.get('/checkout',auth.isLogin,cartController.loadCheckOut);

userRouter.get('/confirmation',auth.isLogin,cartController.loadConfirmation);


//-----------------------------------------ORDER MANAGEMENT---------------------------
userRouter.post('/place-order',auth.ftisLogin,ordersController.placeOrder);

userRouter.get('/list-orders',auth.isLogin,ordersController.listOrders);

userRouter.get('/order-details',auth.isLogin,ordersController.orderDetails);

userRouter.get('/cancel-order',auth.isLogin,ordersController.cancelOrder);

// ----------------------------------ADDRESS MANAGEMENT--------------------

userRouter.post('/add-address',auth.isLogin,userController.addingAddress);
userRouter.get('/manage-address',auth.isLogin,userController.loadManageAddress);
userRouter.get('/edit-address',auth.isLogin,userController.loadEditAddress);
userRouter.post('/edit-address',auth.isLogin,userController.editAddress);
userRouter.get('/delete-address',auth.isLogin,userController.deleteAddress);

// -------------------------------------USER PROFILE ------------------
userRouter.get('/user-profile',auth.isLogin,userController.userProfile);
userRouter.post('/edit-profile',auth.ftisLogin,userController.EditProfile);

// -------------------------------------LOGOUT---------------------

userRouter.get('/logout',userController.logoutUser);

module.exports = userRouter;
