const mongoose = require('mongoose');

const ordersModel = new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user',
   },
   date:{
      type:Date,
      default:Date.now,
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
      name:{
         type:String,
         required:true,
      },
      mobile:{
         type:Number,
         required:true,
      },
      homeAddress:{
         type:String,
         required:true,
      },
      city:{
         type:String,
         required:true,
      },
      street:{
         type:String,
         required:true,
      },
      postalCode:{
         type:Number,
         required:true
      }
   },
   orderStatus:{
      type:String,
      default:'Placed',
   }
})

module.exports = mongoose.model('Order',ordersModel);