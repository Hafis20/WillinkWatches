const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   productName:{
      type:String,
      required:true
   },
   description:{
      type:String,
      required:true
   },
   category:{
      type:String,
      required:true
   },
   stock:{
      type:Number,
      required:true,
   },
   regularPrice:{
      type:Number,
      required:true
   },
   salePrice:{
      type:Number,
      required:true
   },
   images:{
      type:Array,
   },
   is_listed:{
      type:Boolean,
      default:true
   },
   date:{
      type:Date,
      default:Date.now()
   }
})


module.exports = mongoose.model('Product',ProductSchema);