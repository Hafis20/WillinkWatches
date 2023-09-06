const { default: mongoose } = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Address = require('../models/addressModel');

// Load Cart page

const loadCart = async(req,res)=>{
   try {
      const user_id = req.session.user._id
      let cart = await Cart.findOne({userId:user_id}).populate('products.productId');
      if(!cart){
         let newCart = new Cart({userId:req.session.user._id,products:[]});
         await newCart.save();
         cart = newCart;
      }
      else{
         cart.total = cart.products.reduce((total,product)=>{
            return total + product.total;
         },0);
         // console.log(cart.total)
         const userProducts = cart.products;
         const cartTotal = cart.total
         res.render('cart',{products:userProducts,cartTotal});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Add to cart

const addToCart = async(req,res)=>{
   try {
      const proId = req.query.productId;
      
      let cart = await Cart.findOne({userId:req.session.user._id}); // Find the user
      // console.log(cart);

      if(!cart){
         let newCart = new Cart({userId:req.session.user._id,products:[]});
         await newCart.save();
         cart = newCart;
      }
      // console.log(cart);
      
      const existingProductIndex = cart.products.findIndex((product)=>{
         return product.productId.toString() === proId;
      })
      
      if(existingProductIndex === -1){
         const product = await Product.findById(proId).lean();
         const total = product.salePrice;

         cart.products.push({
            productId:proId,
            quantity:1,
            total, //Use the Updated total value
         });
      }else{
         cart.products[existingProductIndex].quantity += 1;
         const product = await Product.findById(proId).lean();
         cart.products[existingProductIndex].total += product.salePrice;
         
      }
      // Calculate the updated total amount for the cart
      cart.total = cart.products.reduce((total,product)=>{
         return total + product.total;
      },0);
      console.log(cart.total);
      
      await cart.save();
      // console.log(cart);

      res.json({status:'success',cartTotal:cart.total});
      
   } catch (error) {
      console.log(error.message);
   }
}

const updateQuantity = async (req, res) => {
   try {
      const userId = new mongoose.Types.ObjectId(req.session.user._id);
      const productId =new mongoose.Types.ObjectId(req.body.proId) ;
      const count = req.body.count;
      // const findCart = await Cart.findOne({userId:userId});
      // console.log('User ID:', userId);
      // console.log('Product ID:', productId);
      // console.log('Count:', count); 
      // console.log('Cart : ', findCart)
      const cart = await Cart.findOneAndUpdate(
         { 
            userId: userId,
            'products.productId':productId
         },
         { $inc: 
            { 'products.$.quantity': count }
         },
         { new: true }
      ).populate('products.productId');

      // Update total 
      const updateProduct = cart.products.find(product=>product.productId._id.equals(productId))
      updateProduct.total = updateProduct.productId.salePrice * updateProduct.quantity
      await cart.save()


      res.json({ status: 'success',message:'Quantity Updated'});
   } catch (error) {
      console.error('Error:', error.message);
      res.json({ status: 'error' });
   }
};

// Loading the checkout page

const loadCheckOut = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      const user = await Address.findOne({userId:user_id}); // Find the user
      const cart = await Cart.findOne({userId:user_id}).populate('products.productId'); // Taking the product details
      const cartDetails = cart.products;
      // console.log(cartDetails)
      cart.total = cart.products.reduce((total,product)=>{
         return total + product.total;
      },0);
      const address = user.address;
      res.render('checkout',{address,cartDetails,grandTotal:cart.total});
   } catch (error) {
      console.log(error.message)
   }
}

const loadConfirmation = async(req,res)=>{
   try {
      res.render('confirmation');
   } catch (error) {
      console.log(error.message);
   }
}
module.exports = {
   loadCart,
   addToCart,
   updateQuantity,
   loadCheckOut,
   loadConfirmation,
}