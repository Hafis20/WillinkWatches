const express = require("express");
const userRouter = express();

//Session
const session = require('express-session')

userRouter.use(session({
   secret:process.env.SECRET_ID,
   resave:false,
   saveUninitialized:false,
}))

// Loading middle ware 


// nocache middleware

const nocache = require('nocache');
userRouter.use(nocache());
// ===============================Controller importing ==============================

// User Controller 

const userController = require("../controllers/userController");

// Cart Controller

const cartController = require('../controllers/cartController');

// Whishlist Controller

const whishlistController = require('../controllers/whishlistController');

// Order Controller

const ordersController = require('../controllers/ordersController');

// Coupon Controller

const couponController = require('../controllers/couponController');
// ========================================================================================

// ----Authentication---

const auth = require('../middleware/userAuth');

//--- Static---
userRouter.use(express.static('public'))

userRouter.set("view engine", "ejs");
userRouter.set("views", "./views/user");
userRouter.use(express.json())
userRouter.use(express.urlencoded({extended:true}))


// =========================================ROUTER STARTS===================


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

// Forget password load
userRouter.get('/forgot-password',auth.isLogout,userController.loadForgetPass);

// Getting the email id
userRouter.post('/forgot-password',userController.forgetPassEmail);

// Verify the otp 
userRouter.post('/verify-forgot-otp',auth.isLogout,userController.verifyForgotOtp);

// Setting new Password
userRouter.post('/set-new-password',userController.setNewPassword);

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

// Low to high sorting
userRouter.get('/price-wise-sort',userController.priceWiseSort);


// -------------------------------------CART------------------------

// Load cart page
userRouter.get('/cart',auth.isLogin,cartController.loadCart);

// Add to cart
userRouter.get('/add-to-cart',auth.ftisLogin,cartController.addToCart);

// Remove product from cart
userRouter.get('/remove-from-cart',auth.ftisLogin,cartController.removeFromCart);

// Incriment the quantity

userRouter.post('/update-quantity',auth.ftisLogin,cartController.updateQuantity);

// Load the checkout page
userRouter.get('/checkout',auth.isLogin,cartController.loadCheckOut);


// Show the confirmation page
userRouter.get('/confirmation',auth.isLogin,cartController.loadConfirmation);

// Show if the user payment failed
userRouter.get('/order-failed',auth.isLogin,cartController.loadOrderFailed);
// ---------------------------------------WHISHLIST---------------------------------
// Load the whishlist page of the user
userRouter.get('/whishlist',auth.isLogin,whishlistController.loadWhishlist);

// Adding the product into user whishlist
userRouter.get('/add-to-whishlist',auth.ftisLogin,whishlistController.addtoWhishlist);

// Remove product from whishlist 
userRouter.get('/remove-from-whishlist',auth.ftisLogin,whishlistController.removeFromWhishlist);

//-----------------------------------------ORDER MANAGEMENT---------------------------
// Placing the order
userRouter.post('/place-order',auth.ftisLogin,ordersController.placeOrder);

// If the user choose online payment we verify the order is success or failure
userRouter.post('/verify-payment',auth.isLogin,ordersController.verifyOnlinePayment);

// After Confirmation invoice router
userRouter.get('/invoice',auth.isLogin,ordersController.invoice);

// Showing the list of orders into user
userRouter.get('/list-orders',auth.isLogin,ordersController.listOrders);

// Showing the order details
userRouter.get('/order-details',auth.isLogin,ordersController.orderDetails);

// Cancelling the order
userRouter.get('/cancel-order',auth.isLogin,ordersController.cancelOrder);

// Return the order
userRouter.post('/return-order',auth.ftisLogin,ordersController.returnOrder);

// ----------------------------------ADDRESS MANAGEMENT--------------------

userRouter.post('/add-address',auth.isLogin,userController.addingAddress);
userRouter.get('/manage-address',auth.isLogin,userController.loadManageAddress);
userRouter.get('/edit-address',auth.isLogin,userController.loadEditAddress);
userRouter.post('/edit-address',auth.isLogin,userController.editAddress);
userRouter.get('/delete-address',auth.isLogin,userController.deleteAddress);


// -----------------------------------COUPON MANAGEMENT---------------------
userRouter.get('/apply-coupon',auth.ftisLogin,couponController.applyCoupons);

// --------------------------------------WALLET---------------------------
// To load the wallet page
userRouter.get('/view-wallet',auth.isLogin,userController.loadWallet);

// To recharge the wallet amount
userRouter.post('/recharge-wallet',auth.ftisLogin,userController.rechargeWallet);
// -------------------------------------USER PROFILE ------------------
userRouter.get('/user-profile',auth.isLogin,userController.userProfile);
userRouter.post('/edit-profile',auth.ftisLogin,userController.EditProfile);
userRouter.post('/change-password',auth.ftisLogin,userController.changePassword);

// -------------------------------------LOGOUT---------------------

userRouter.get('/logout',userController.logoutUser);

module.exports = userRouter;
