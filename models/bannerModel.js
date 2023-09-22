const mongoose = require('mongoose');

const bannerModel = new mongoose.Schema({
   title:{
      type:String,
      required:true,
   },
   description:{
      type:String,
   },
   date:{
      type:Date,
   },
   isListed:{
      type:Boolean,
      default:true,
   },
   image:{
      type:String
   }
})

module.exports = mongoose.model('Banner',bannerModel);