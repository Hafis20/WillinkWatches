const express = require('express');
const adminRouter = express();


// Public folder
adminRouter.use(express.static('public'))
adminRouter.set('view engine','ejs');
adminRouter.set('views','./views/admin')

//Admin Controller
const adminController = require('../controllers/adminController')

adminRouter.get('/',adminController.loadDashboard)

module.exports = adminRouter;