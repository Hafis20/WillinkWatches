const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user',
      required:true,
   },
   address:[{
      name:{
         type:String,
         required:true,
      },
      mobile:{
         type:Number,
      },
      homeAddress:{
         type:String,
      },
      city:{
         type:String,
      },
      street:{
         type:String,
      },
      postalCode:{
         type:Number,
      },
      isDefault:{
         type:Boolean,
         default:false
      }
   }]
})


module.exports = mongoose.model('Address',addressSchema);