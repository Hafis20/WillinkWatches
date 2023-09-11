const Product = require('../models/productModel');
const Category = require('../models/categoryModel')

// ================================PRODUCT==================================

// Rendering the product list

const loadProductList = async(req,res)=>{
   try {
      const products = await Product.find().populate('category');
      // console.log('It contains the whole data of category',products)
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
      const {productName,description,category,stock,regularPrice,salePrice} = req.body
      const images = [];
      for(let i=0;i<req.files.length;i++){
         images.push(req.files[i].filename);
      }
      const findCategory = await Category.findOne({categoryName:category});
      const categoryId = findCategory._id
         const productData = await Product.create({
            productName:productName,
            description:description,
            category:categoryId,
            stock:stock,
            regularPrice:regularPrice,
            salePrice:salePrice,
            images:images,
         })
         await productData.save();
         const categoryList = await Category.find();
         res.render('add-products',{categories:categoryList,message:'Product Added'});
   } catch (error) {
      console.log(error.message);
   }
}

// Load edit products

const loadEditProduct = async(req,res)=>{
   try {
      const id = req.query.id;
      const productData = await Product.findById(id).populate('category');
      // console.log(productData)
      if(productData){
         const categories = await Category.find()
         res.render('edit-products',{productData,categories});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Edit the products 

const editProduct = async(req,res)=>{
   try {
      const {productName, description, regularPrice, salePrice, stock, categoryId, id } = req.body
      // console.log(categoryId)
      const images = [];
      for(let i=0;i<req.files.length;i++){
         images.unshift(req.files[i].filename);
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

      if(images.length <=1 ){
         const productData = await Product.findById(id).populate('category');
      // console.log(productData)
         if(productData){
         const categories = await Category.find()
         res.render('edit-products',{productData,categories,message:'Set atleast Two Images'});
         }
      }else{
         const UpdatedData = await Product.findByIdAndUpdate(id,
            {$set:{
               productName:productName,
               description:description,
               regularPrice:regularPrice,
               salePrice:salePrice,
               stock:stock,
               category:categoryId,
               images:images,
            }})
            if(UpdatedData){
               res.redirect('/admin/list-products');
            }
      }
      
   } catch (error) {
      console.log(error.message)
   }
}

// Remove image while editing
const removeImage = async(req,res)=>{
   try {
      const {imageFile , productId} = req.body
      console.log('Image File :',imageFile);
      // console.log('Product Id :', productId);

      const product = await Product.findById(productId);
      product.images = product.images.filter(img=>img !== imageFile);
      
      await product.save();
      res.json({status:'success',message:'Image removed'})
   } catch (error) {
      res.json({status:'error',message:error.message})
      console.log(error.message);
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
   removeImage, // remove image while editing
   unListProducts,
   listProducts,
}