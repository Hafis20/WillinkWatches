const Product = require('../models/productModel');
const Category = require('../models/categoryModel')

// ================================PRODUCT==================================

// Rendering the product list

const loadProductList = async(req,res)=>{
   try {
      const products = await Product.find();
      res.render('list-products',{products:products});
   } catch (error) {
      console.log(error.message);
   }
}

// Load product add page

const loadaddProducts = async(req,res)=>{
   try {
      const category = await Category.find();
      if(category){
         res.render('add-products',{categories:category});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// add Products

const addProducts = async(req,res)=>{
   try {  
      const images = [];
      for(let i=0;i<req.files.length;i++){
         images.push(req.files[i].filename);
      }
         const productData = await Product.create({
            productName:req.body.productName,
            description:req.body.description,
            category:req.body.category.toUpperCase(),
            stock:req.body.stock,
            regularPrice:req.body.regularPrice,
            salePrice:req.body.salePrice,
            images:images,
         })
         await productData.save();
         const category = await Category.find();
         res.render('add-products',{categories:category,message:'Product Added'});
   } catch (error) {
      console.log(error.message);
   }
}

// Load edit products

const loadEditProduct = async(req,res)=>{
   try {
      const id = req.query.id;
      const productData = await Product.findById(id);
      const categoryData = await Category.find();
      if(productData){
         const category = await Category.findOne({categoryName:productData.category})
         res.render('edit-products',{products:productData,categories:categoryData,category});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Edit the products 

const editProduct = async(req,res)=>{
   try {
      const {productName, description, regularPrice, salePrice, stock, category, id } = req.body
      const images = [];
      for(let i=0;i<req.files.length;i++){
         images.push(req.files[i].filename);
      }
      if(images.length === 0){
         const product = await Product.findById(id);
         for(let i=0;i<product.images.length;i++){
            images.push(product.images[i]);
         }
      }else{
         const product = await Product.findById(id);
         for(let i = 0;i<product.images.length;i++){
            images.unshift(product.images[i]);
         }
      }
      const UpdatedData = await Product.findByIdAndUpdate(id,
         {$set:{
            productName:productName,
            description:description,
            regularPrice:regularPrice,
            salePrice:salePrice,
            stock:stock,
            category:category,
            images:images,
         }})
         if(UpdatedData){
            res.redirect('/admin/list-products');
         }
   } catch (error) {
      console.log(error.message)
   }
}

// unlist product 

const unListProducts = async(req,res)=>{
   try {
      const id = req.query.id;
      const productData = await Product.findByIdAndUpdate(id,
         {$set:{
            is_listed:false
         }})
         if(productData){
            res.redirect('/admin/list-products');
         }
   } catch (error) {
      console.log(error.message)
   }
}
// For listing the products
const listProducts = async(req,res)=>{
   try {
      const id = req.query.id;
      const productData = await Product.findByIdAndUpdate(id,
      {$set:{
         is_listed:true
      }})
      if(productData){
         res.redirect('/admin/list-products')
      }
   } catch (error) {
      console.log(error.message)
   }
}


module.exports = {
   //=====Product========
   loadProductList,
   loadaddProducts,
   addProducts,
   loadEditProduct, 
   editProduct,
   unListProducts,
   listProducts,
}