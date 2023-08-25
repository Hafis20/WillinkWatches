const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   productName:{
      type:String,
      
   },
   description:{
      type:String,
      
   },
   category:{
      type:String
   },
   regularPrice:{
      type:Number,
      
   },
   salePrice:{
      type:Number,
      
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