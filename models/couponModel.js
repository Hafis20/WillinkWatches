const mongoose = require('mongoose');

const couponModel = new mongoose.Schema({
   couponCode:{
      type:String,
      required:true,
   },
   couponDiscription:{
      type:String,
      required:true,
   },
   discountPercentage:{
      type:Number,
      required:true,
   },
   minOrderAmount:{
      type:Number,
      required:true,
   },
   maxDiscountAmount:{
      type:Number,
      required:true,
   },
   validFor:{
      type:Date,
      required:true,
   },
   createdOn:{
      type:Date,
      required:true,
   },
   isActive:{
      type:Boolean,
      default:true,
      required:true,
   }
})


module.exports = mongoose.model('Coupon',couponModel);