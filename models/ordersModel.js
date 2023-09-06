const mongoose = require('mongoose');

const ordersModel = new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user',
   },
   date:{
      type:Date,
      required:true,
   },
   totalAmount:{
      type:Number,
      required:true,
   },
   paymentMethod:{
      type:String,
   },
   products:[{
      productId:{
         type:mongoose.Types.ObjectId,
         ref:'Product'
      },
      quantity:{
         type:Number,
      },
      salePrice:{
         type:Number,
      },
      total:{
         type:Number,
      }
   }],
   address:{
      type:mongoose.Types.ObjectId,
      required:true,
   },
   orderStatus:{
      type:String,
      default:'Placed',
   }
})

