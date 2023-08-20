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
   is_deleted:{
      type:Boolean,
      default:false,
   }
})

module.exports = mongoose.model('category',categorySchema); 