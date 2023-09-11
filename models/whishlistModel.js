const mongoose = require('mongoose');

const whishlistModel = new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user',
      required:true
   },
   
   products:[{
      productId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Product'
      },
      date:{
         type:Date,
         default:Date.now()
      }
   }
   ]
})

module.exports = mongoose.model('Whishlist',whishlistModel);