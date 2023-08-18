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
               res.redirect('/admin/dashboard'); // if admin redirecting the page
            }else{
               res.render('admin-login',{message:'Invalid Admin'});
            }
         }else{
            res.render('admin-login',{message:'Incorrect email or password'});
         }
      }else{
         res.render('admin-login',{message:'Incorrect email or password'}); 
      }
   } catch (error) {
      console.log(error.message);
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

// Rendering the product list

const loadProductList = async(req,res)=>{
   try {
      res.render('product-list');
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
      const categories = await Category.find().sort({categoryName:1});
      res.render('list-categories',{categories:categories})      
   } catch (error) {
      console.log(error.message)
   }
}

// Delete Category

const deleteCategories = async(req,res)=>{
   try {
      const id = req.query.id;
      const category = await Category.findByIdAndDelete(id)
      res.redirect('/admin/list-categories')
   } catch (error) {
      console.log(error)
   }
}


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
   logoutAdmin,
   loadProductList,
   loadaddProducts,
   loadaddCategories,
   addCategories,
   listCategories,
   deleteCategories
}