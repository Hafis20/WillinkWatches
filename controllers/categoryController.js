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
      const categoryName = req.body.categoryName;
      const discription = req.body.discription;
      const id = req.body.id;
      // Only this category is existed or not
      const allCategory = await Category.find();
      const category = await Category.findById(id);

         if(category){
            if(category.categoryName === categoryName.toUpperCase() && category.discription === discription){
               res.json({status:'success',message:'Update successfull'})   
               
            }else if(category.categoryName === categoryName.toUpperCase()){
               const updateCategory = await Category.findByIdAndUpdate(id,
                  {$set:{
                     discription:discription
                  }},{new:true});
                  if(updateCategory){
                     res.json({status:'success',message:'Update successfull'})
                  }
            }else{
               // Finding the existing category
               const existingCategoryName = allCategory.filter((category)=>category.categoryName === categoryName.toUpperCase());
               
               if(existingCategoryName.length > 0){
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