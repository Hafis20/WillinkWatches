const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const pass = require('../helpers/securePass')

// Load admin Login page
const loadLogin = async(req,res)=>{
   try {
      res.render('admin-login');
   } catch (error) {
      console.log(error.message);
   }
}

// Verify this is original admin or not 
// Inputs are email and password from the form

const verifyAdmin = async(req,res)=>{
   try {
      const {email,password} = req.body;
      const adminData = await User.findOne({email:email}); // Checking if data is available in database
      if(adminData){
         const isMatch = await pass.checkPassword(password,adminData.password); // if available then we check the password is correct
         if(isMatch){
            if(adminData.is_admin === true){ // if correct then we check it is user or admin
               req.session.admin = adminData;
               res.json({status:'success',message:'Login successfull'}) // if admin redirecting the page
            }else{
               res.json({status:'error',message:'Invalid admin'});;
            }
         }else{
            res.json({status:'error',message:'Incorrect email or password'});
         }
      }else{
         res.json({status:'error',message:'Incorrect email or password'});
      }
   } catch (error) {
      console.log(error.message);
      res.json({status:'error',message:'Server side issue'});
   }
}


// Rendering the admin Dashboard
const loadDashboard = async(req,res)=>{
   try {
   res.render('adminDashboard');
   } catch (error) {
      console.log(error.message);
   }
}
//=================================USERS===================================

//Load users list page 

const loadUsersList = async(req,res)=>{
   try {
      const usersData = await User.find({is_admin:false,is_blocked:false});
      if(usersData){
         res.render('list-users',{users:usersData});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Load edit Users

const loadEditUsers = async(req,res)=>{
   try {
      const id = req.query.id
      const userData = await User.findById(id);
      if(userData){
         res.render('edit-users',{user:userData});
      }
   } catch (error) {
      console.log(error.message)
   }
}
// Edit users

const editUsers = async(req,res)=>{
   try {
      const {firstName,lastName,id}= req.body;
      if(!firstName){
         res.json({status:'error',message:'First name is required'});
      }
      else if(!lastName){
         res.json({status:'error',message:'Last Name required'})
      }else{
         const usersData = await User.findByIdAndUpdate(id,
            {$set:{
               firstName:firstName,
               lastName:lastName
            }})
            res.json({status:'success',message:'Successfully Updated'})
      }
   } catch (error) {
      console.log(error.message);
      res.json({status:'error',message:'Server side issue'});
   }
}

// Block user
const blockUser = async(req,res)=>{
   try {
      const id = req.query.id;
      const userData = await User.findByIdAndUpdate(id,
         {$set:{
            is_blocked:true
         }})
        res.redirect('/admin/list-users')
   } catch (error) {
      console.log(error.message)
   }
}
// Load unblock user list
const loadBlockedUser = async(req,res)=>{
   try {
      const userData = await User.find({is_blocked:true});
      res.render('list-blocked-users',{users:userData});
   } catch (error) {
      console.log(error.message);
   }
}
// Unblock User
const unBlockUser = async(req,res)=>{
   try {
      const id = req.query.id
      const userData = await User.findByIdAndUpdate(id,
         {$set:{
            is_blocked:false
         }})
         res.redirect('/admin/list-blocked-users');
   } catch (error) {
      console.log(error.message);
   }
}

// ================================PRODUCT==================================

// Rendering the product list

const loadProductList = async(req,res)=>{
   try {
      res.render('list-products');
   } catch (error) {
      console.log(error.message);
   }
}

// Load product add page

const loadaddProducts = async(req,res)=>{
   try {
      res.render('add-products');
   } catch (error) {
      console.log(error.message);
   }
}

// add Products

const addProducts = async(req,res)=>{
   try {
      
   } catch (error) {
      console.log(error.message);
   }
}


//=================================CATEGORY=================================


// Load the add category page

const loadaddCategories = async(req,res)=>{
   try {
      res.render('add-categories')
   } catch (error) {
      console.log(error.message);
   }
}

// Add category

const addCategories = async(req,res)=>{
   try {
      const {categoryName,discription} = req.body;
      const nameExists = await Category.findOne({categoryName:categoryName});
      if(nameExists){
         res.json({status:'error',message:'Category is already Exists'})
      }else{
         const category = await Category.create({
            categoryName :categoryName,
            discription : discription,
         });
         const categoryData = await category.save()
         res.json({status:'success',message:'Category added successfully'})
      }
   } catch (error) {
      res.json({status:'error',message:'Feilds are required'});
   }
}
// List category
const listCategories = async(req,res)=>{
   try {
      const categories = await Category.find({is_deleted:false}).sort({categoryName:1});
      res.render('list-categories',{categories:categories})      
   } catch (error) {
      console.log(error.message)
   }
}

// Load Edit Category page 

const loadEditCategories = async(req,res)=>{
   try {
      const id = req.query.id;
      const category = await Category.findById(id,{is_deleted:false});
      if(category){
         res.render('edit-categories',{category:category});
      }
   } catch (error) {
      console.log(error.message)
   }
}

// Update Edited Catagory
const editCategories = async(req,res)=>{
   try {
      const {categoryName,discription,id} = req.body
      if(!categoryName){
         res.json({status:'error',message:'Category Name is required'});
      }else if(!discription){
         res.json({status:'error',message:'Discription is required'});
      }else{
         const updateCategory = await Category.findByIdAndUpdate(id,
            {$set:{
               categoryName:categoryName,
               discription:discription
            }})
            if(updateCategory){
               res.json({status:'success',message:'Update successfull'})
            }else{
               res.json({status:'error',message:'Please check your data'})
            }
      }
      
   } catch (error) {
      console.log(error.message)
      res.json({status:'error',message:'Feild is required'})
   }
}
// Delete Category

const deleteCategories = async(req,res)=>{
   try {
      const id = req.query.id;
      const category = await Category.findByIdAndUpdate(id,
         {$set:{
            is_deleted:true
         }})
      res.redirect('/admin/list-categories')
   } catch (error) {
      console.log(error)
   }
}
// ======================================ADMIN LOGOUT================================

const logoutAdmin = async(req,res)=>{
   try {
      req.session.admin = null;
      res.redirect('/admin/login');
   } catch (error) {
      console.log(error.message);
   }
}

module.exports = {
   loadLogin,
   verifyAdmin,
   loadDashboard,
   //=====User======
   loadUsersList,
   loadEditUsers,
   editUsers,
   blockUser,
   loadBlockedUser,
   unBlockUser,
   //=====Product========
   loadProductList,
   loadaddProducts,
   addProducts,
   //=====Category========
   loadaddCategories,
   addCategories,
   listCategories,
   loadEditCategories,
   editCategories,
   deleteCategories,
   //======Logout========
   logoutAdmin,
}