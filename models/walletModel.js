const mongoose = require('mongoose');


const walletModel = new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user',
      required:true,
   },
   walletAmount:{
      type:Number,
      default:0,
   },
   transactionHistory:{
      type:Array,
   }
})


module.exports = mongoose.model('Wallet',walletModel)