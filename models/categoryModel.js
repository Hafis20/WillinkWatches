const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   categoryName:{
      type:String,
      required:true,
   },
   discription:{
      type:String,
      required:true,
   },
   is_listed:{
      type:Boolean,
      default:true,
   }
})

module.exports = mongoose.model('category',categorySchema); 