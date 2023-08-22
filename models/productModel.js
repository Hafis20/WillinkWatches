const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   productName:{
      type:String,
      required:true,
   },
   description:{
      type:String,
      required:true,
   },
   category:{
      type:String,
      required:true,
   },
   regularPrice:{
      type:Number,
      required:true,
   },
   salePrice:{
      type:Number,
      required:true,
   },
   images:{
      type:Array,
      required:true,
   },
   is_deleted:{
      type:Boolean,
      default:false
   }
})


module.exports = mongoose.model('Product',ProductSchema);