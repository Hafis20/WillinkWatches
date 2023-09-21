const Whishlist = require('../models/whishlistModel');

const loadWhishlist = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      let userWhishlist = await Whishlist.findOne({userId:user_id}).populate('products.productId');
      if(!userWhishlist){
         userWhishlist = new Whishlist({userId:user_id,products:[]})
         await userWhishlist.save()
      }
      // console.log(userWhishlist.products)

      res.render('whishlist',{userWhishlist:userWhishlist.products});
   } catch (error) {
      console.log(error.message);
   }
}

const addtoWhishlist = async(req,res)=>{
   try {
      const user_id = req.session.user._id
      const productId = req.query.productId;
      // console.log(productId);
      // console.log(user_id);
      let userWhishlist = await Whishlist.findOne({userId:user_id})

      if(!userWhishlist){
         userWhishlist = new Whishlist({userId:user_id,products:[]})
         await userWhishlist.save()
      }
      if(userWhishlist){
         const findProduct = userWhishlist.products.findIndex(product=>product.productId.toString() === productId);
         // console.log(findProduct)
         if(findProduct === -1){
            userWhishlist.products.push({
               productId:productId,
               date:Date.now()
            })
            await userWhishlist.save()
            res.json({status:'success',message:'Added to Whishlist'});
         }else{
            res.json({status:'error',message:'Item Already exist in Whishlist'})
         }
      }  
   } catch (error) {
      console.log(error.message);
   }
}

const removeFromWhishlist = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      const productId = req.query.productId;

      const products = await Whishlist.findOneAndUpdate({userId:user_id},
         {$pull:{
            products:{productId:productId},
         }},
         {new:true});
      res.json({status:'success',message:'Product Removed'})
   } catch (error) {
      res.json({status:'error',message:'Something went wrong'});
      console.log(error.message);
   }
}
module.exports = {
   loadWhishlist,
   addtoWhishlist,
   removeFromWhishlist,
}