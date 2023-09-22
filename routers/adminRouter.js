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
const ordersController = require('../controllers/ordersController');
const couponController = require('../controllers/couponController');
const bannerController = require('../controllers/bannerController');


// -------------------------------------ADMIN--------------------------------

// Load login page for admin
adminRouter.get('/',auth.isLogout,adminController.loadLogin)

// Verify It is original admin or not
adminRouter.post('/',auth.isLogout,adminController.verifyAdmin)

// Load the dashboard
adminRouter.get('/dashboard',auth.isLogin,adminController.loadDashboard);

// ====Sales Report===
// Loading the sales report page
adminRouter.get('/sales-report',auth.isLogin,adminController.loadSalesReport);

// Filtering the sales report
adminRouter.get('/filter-sales',auth.isLogin,adminController.filterSales);

// Filter the sales report using the dates
adminRouter.post('/datewise-filter-sales',auth.isLogin,adminController.dateWiseSales);

// Taking the pdf
adminRouter.post('/generate-pdf',auth.isLogin,adminController.generateSalesPdf);

// --------------------------------------USERS--------------------------------

//Load users list
adminRouter.get('/list-users',auth.isLogin,adminController.loadUsersList);

// Edit User
adminRouter.get('/edit-users',auth.isLogin,adminController.loadEditUsers);
adminRouter.post('/edit-users',auth.isLogin,adminController.editUsers);

// Block User
adminRouter.get('/block-users',auth.isLogin,adminController.blockUser);
// Load blocked Users list
adminRouter.get('/unblock-users',auth.isLogin,adminController.unBlockUser)


//---------------------------------------PRODUCTS-----------------------------

// Load products List
adminRouter.get('/list-products',auth.isLogin,productController.loadProductList);

// Load add products
adminRouter.get('/add-products',auth.isLogin,productController.loadaddProducts);

// add products
adminRouter.post('/add-products',upload.array('images'),productController.addProducts);

// Load edit products
adminRouter.get('/edit-products',auth.isLogin,productController.loadEditProduct);

// Edit products
adminRouter.post('/edit-products',upload.array('images'),productController.editProduct);

// Remove image While editing
adminRouter.post('/remove-image',auth.isLogin,productController.removeImage);

// Unlisting Products
adminRouter.get('/is-unlist-products',auth.isLogin,productController.unListProducts);

// Listing Products
adminRouter.get('/is-list-products',auth.isLogin,productController.listProducts)

//---------------------------------------CATEGORY-----------------------------

// Load add Categories
adminRouter.get('/add-category',auth.isLogin,categoryController.loadaddCategories);
adminRouter.post('/add-category',auth.isLogin,categoryController.addCategories);

// List Categories
adminRouter.get('/list-categories',auth.isLogin,categoryController.loadCategories);

// Edit Category
adminRouter.get('/edit-categories',auth.isLogin,categoryController.loadEditCategories);
adminRouter.post('/edit-categories',auth.isLogin,categoryController.editCategories);

// List/Unlist Category
adminRouter.get('/is-unlist-categories',auth.isLogin,categoryController.unListCategories);
adminRouter.get('/is-list-categories',auth.isLogin,categoryController.listCategories);



//----------------------------------------------ORDERS-----------------------------
adminRouter.get('/list-orders',auth.isLogin,ordersController.loadOrdersPage);
adminRouter.get('/order-details',auth.isLogin,ordersController.adminOrderDetails);
adminRouter.post('/change-status',auth.isLogin,ordersController.changeStatus);


// -------------------------------------------COUPONS-----------------------------
// To load the list of coupons
adminRouter.get('/list-coupons',auth.isLogin,couponController.listCoupons);

// Load Add the coupons page
adminRouter.get('/add-coupon',auth.isLogin,couponController.loadAddCoupons);

// Add coupons
adminRouter.post('/add-coupon',auth.isLogin,couponController.addCoupons);

// Inactivate the coupon
adminRouter.get('/change-coupon-status',auth.isLogin,couponController.changeCouponStatus);

// -------------------------------------------BANNERS------------------------
// Getting the list of banners
adminRouter.get('/list-banners',auth.isLogin,bannerController.listBanners);

// Load Add the banner page
adminRouter.get('/add-banner',auth.isLogin,bannerController.LoadaddBanner);

// Add Banner
adminRouter.post('/add-banner',upload.single('images'),bannerController.addBanner);

// Unlist the banner
adminRouter.get('/change-banner-status',auth.isLogin,bannerController.changeBannerStatus)

//Logout
adminRouter.get('/logout',auth.isLogin,adminController.logoutAdmin)

module.exports = adminRouter;