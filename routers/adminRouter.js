const express = require('express');
const adminRouter = express();


//Session Handling 
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
   uri:process.env.MONGO_URL,
   collection:'mySession'
})

adminRouter.use(session({
   secret:process.env.SECRET_ID,
   resave:false,
   saveUninitialized:false,
   store:store
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

//Logout
adminRouter.get('/logout',adminController.logoutAdmin)

module.exports = adminRouter;