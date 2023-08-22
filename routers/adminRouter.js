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


// -------------------------------------ADMIN--------------------------------

//Admin Controller
const adminController = require('../controllers/adminController')
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
adminRouter.get('/list-blocked-users',adminController.loadBlockedUser)
adminRouter.get('/unblock-users',adminController.unBlockUser)


//---------------------------------------PRODUCTS-----------------------------

// Load products List
adminRouter.get('/list-products',adminController.loadProductList);

// Load add products
adminRouter.get('/add-products',adminController.loadaddProducts);

// add products
adminRouter.post('/add-products',upload.single('images'),adminController.addProducts);

// Load edit products
adminRouter.get('/edit-products',adminController.loadEditProduct);

// Edit products
adminRouter.post('/edit-products',upload.single('images'),adminController.editProduct);

// Delete Products
adminRouter.get('/delete-products',adminController.deleteProduct);

//---------------------------------------CATEGORY-----------------------------

// Load add Categories
adminRouter.get('/add-categories',adminController.loadaddCategories);
adminRouter.post('/add-categories',adminController.addCategories);

// List Categories
adminRouter.get('/list-categories',adminController.listCategories);

// Edit Category
adminRouter.get('/edit-categories',adminController.loadEditCategories);
adminRouter.post('/edit-categories',adminController.editCategories);

// Delete Category
adminRouter.get('/delete-categories',adminController.deleteCategories);

//--------------------------------------------------------------------------


//Logout
adminRouter.get('/logout',auth.isLogin,adminController.logoutAdmin)

module.exports = adminRouter;