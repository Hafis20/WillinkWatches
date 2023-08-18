const express = require('express');
const adminRouter = express();


//Session Handling 
const session = require('express-session');


adminRouter.use(session({
   secret:process.env.SECRET_ID,
   resave:false,
   saveUninitialized:false,
}));

//nocache middleware
const nocache = require('nocache');
adminRouter.use(nocache());

// Authentication 
const auth = require('../middleware/adminAuth');

// Public folder
adminRouter.use(express.static('public'))
adminRouter.set('view engine','ejs');
adminRouter.set('views','./views/admin')

//Admin Controller
const adminController = require('../controllers/adminController')
// Load login page for admin
adminRouter.get('/',auth.isLogout,adminController.loadLogin)
adminRouter.get('/login',auth.isLogout,adminController.loadLogin)

// Verify It is original admin or not
adminRouter.post('/',adminController.verifyAdmin)
adminRouter.post('/login',adminController.verifyAdmin)

// Load the dashboard
adminRouter.get('/dashboard',auth.isLogin,adminController.loadDashboard);

// Load products List
adminRouter.get('/product-list',auth.isLogin,adminController.loadProductList);

// Load add products
adminRouter.get('/add-products',auth.isLogin,adminController.loadaddProducts);


// Load add Categories
adminRouter.get('/add-categories',auth.isLogin,adminController.loadaddCategories);
adminRouter.post('/add-categories',adminController.addCategories);
// List Categories
adminRouter.get('/list-categories',adminController.listCategories);
// Delete Category
adminRouter.get('/delete-categories',adminController.deleteCategories);


//Logout
adminRouter.get('/logout',auth.isLogin,adminController.logoutAdmin)

module.exports = adminRouter;