const Category = require('../models/categoryModel');

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
      const nameExists = await Category.findOne({categoryName:categoryName.toUpperCase()});
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
const loadCategories = async(req,res)=>{
   try {
      const categories = await Category.find().sort({categoryName:1});
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
     // This category name already existing or not
      // Taking the whole category list
         const category = await Category.find();
         // Taking the categories other than edit
         const existingCategory =  category.filter((category) => category._id.toString() !== id);
         // In other categories exist the name which user provided
         const categoryExist = existingCategory.find((category)=>category.categoryName === categoryName.toUpperCase());
         
         // if provided or not
         if(categoryExist){
            res.json({status:'error',message:'Category Already Exists'});
         }else{
            const updateCategory = await Category.findByIdAndUpdate(id,
               {$set:{
                  categoryName:categoryName.toUpperCase(),
                  discription:discription
               }})
               if(updateCategory){
                  res.json({status:'success',message:'Update successfull'})
               }
         }
   } catch (error) {
      console.log(error.message)
      res.json({status:'error',message:'Feild is required'})
   }
}
// Delete Category

const unListCategories = async(req,res)=>{
   try {
      const id = req.query.id;
      const category = await Category.findByIdAndUpdate(id,
         {$set:{
            is_listed:false
         }})
      res.redirect('/admin/list-categories')
   } catch (error) {
      console.log(error)
   }
}

const listCategories = async(req,res)=>{
   try {
      const id = req.query.id
   const category = await Category.findByIdAndUpdate(id,
      {$set:{
         is_listed:true,
      }})
      res.redirect('/admin/list-categories')
   } catch (error) {
      console.log(error.message);
   }
}

module.exports = {
   //=====Category========
   loadaddCategories,
   addCategories,
   loadCategories,
   loadEditCategories,
   editCategories,
   unListCategories,
   listCategories,
}