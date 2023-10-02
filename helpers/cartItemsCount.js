const Cart = require('../models/cartModel');


// It means that we are taking data from server 
// Because It has no Cart data
const findCartItemsCount = async(userId)=>{
   try{
      const user_id = userId;
      let userCart = await Cart.findOne({userId:user_id});
      // console.log(userCart);
      if(!userCart){
         userCart = new Cart({userId:user_id,products:[]});
         await userCart.save();
      }

      const count = userCart.products.reduce((acc,product)=>{
         return acc += product.quantity;
      },0)
      return count;
   }catch(error){
      console.log(error.message);
   }
}

// They are already find the cart data so we can easly find the total using that cart
const findCartItemsCountFromCart = async(cart)=>{
   try {
      const count = cart.products.reduce((acc,product)=>{
         return acc += product.quantity;
      },0)
      return count;
   } catch (error) {
      console.log(error.message);
   }
}

module.exports = {
   findCartItemsCount,
   findCartItemsCountFromCart
}
