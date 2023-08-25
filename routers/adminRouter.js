const express = require('express');
const adminRouter = express();


//Session Handling 
const session = require('express-session');

// Path
const path = require('path');

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

// Multer
const upload = require('../helpers/multer');
// ====================================MODULE REQUIRE=========================
//Admin Controller
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');


// -------------------------------------ADMIN--------------------------------

// Load login page for admin
adminRouter.get('/',auth.isLogout,adminController.loadLogin)

// Verify It is original admin or not
adminRouter.post('/',adminController.verifyAdmin)

// Load the dashboard
adminRouter.get('/dashboard',adminController.loadDashboard);
// --------------------------------------USERS--------------------------------

//Load users list
adminRouter.get('/list-users',adminController.loadUsersList);

// Edit User
adminRouter.get('/edit-users',adminController.loadEditUsers);
adminRouter.post('/edit-users',adminController.editUsers);

// Block User
adminRouter.get('/block-users',adminController.blockUser);
// Load blocked Users list
adminRouter.get('/unblock-users',adminController.unBlockUser)


//---------------------------------------PRODUCTS-----------------------------

// Load products List
adminRouter.get('/list-products',productController.loadProductList);

// Load add products
adminRouter.get('/add-products',productController.loadaddProducts);

// add products
adminRouter.post('/add-products',upload.array('images'),productController.addProducts);

// Load edit products
adminRouter.get('/edit-products',productController.loadEditProduct);

// Edit products
adminRouter.post('/edit-products',upload.array('images'),productController.editProduct);

// Delete Products
adminRouter.get('/is-unlist-products',productController.unListProducts);

adminRouter.get('/is-list-products',productController.listProducts)

//---------------------------------------CATEGORY-----------------------------

// Load add Categories
adminRouter.get('/add-categories',categoryController.loadaddCategories);
adminRouter.post('/add-categories',categoryController.addCategories);

// List Categories
adminRouter.get('/list-categories',categoryController.loadCategories);

// Edit Category
adminRouter.get('/edit-categories',categoryController.loadEditCategories);
adminRouter.post('/edit-categories',categoryController.editCategories);

// List/Unlist Category
adminRouter.get('/is-unlist-categories',categoryController.unListCategories);
adminRouter.get('/is-list-categories',categoryController.listCategories);

//--------------------------------------------------------------------------


//Logout
adminRouter.get('/logout',auth.isLogin,adminController.logoutAdmin)

module.exports = adminRouter;