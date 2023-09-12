const { default: mongoose } = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const Order = require('../models/ordersModel');

// Load Cart page

const loadCart = async(req,res)=>{
   try {
      const user_id = req.session.user._id
      let cart = await Cart.findOne({userId:user_id}).populate('products.productId');
      if(!cart){
         cart = new Cart({userId:req.session.user._id,products:[]});
         await cart.save();
      }
         cart.total = cart.products.reduce((total,product)=>{
            return total + product.total;
         },0);
         // console.log(cart.total)
         const userProducts = cart.products;
         const cartTotal = cart.total
         res.render('cart',{products:userProducts,cartTotal});

   } catch (error) {
      console.log(error.message);
   }
}

// Add to cart

const addToCart = async(req,res)=>{
   try {
      const proId = req.query.productId;
      console.log(proId)
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

// Remove product from the cart
const removeFromCart = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      const productId = req.query.productId;

      const products = await Cart.findOneAndUpdate({userId:user_id},
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

// Loading the checkout page

const loadCheckOut = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      let userAddress = await Address.findOne({userId:user_id}); // Find the user

      // If no user
      if(!userAddress){
         userAddress = new Address({userId:user_id,address:[]});
         await userAddress.save();
      }

      const cart = await Cart.findOne({userId:user_id}).populate('products.productId'); // Taking the product details
      const cartDetails = cart.products;
      cart.total = cart.products.reduce((total,product)=>{
         return total + product.total;
      },0);

      const address =userAddress.address;

      
      res.render('checkout',{address,cartDetails,grandTotal:cart.total});
   } catch (error) {
      console.log(error.message)
   }
}

const loadConfirmation = async(req,res)=>{
   try {
      const orderId = req.query.orderId
      
      const orderDetails = await Order.findById(orderId).populate('products.productId')

      // console.log(orderDetails.products)
      res.render('confirmation',{orderDetails});
   } catch (error) {
      console.log(error.message);
   }
}

const loadOrderFailed = async(req,res)=>{
   try {
      const orderId = req.query.orderId;

      const orderDetails = await Order.findById(orderId);
      res.render('order-failed',{orderDetails});
   } catch (error) {
      console.log(error.message)
   }
}
module.exports = {
   loadCart,
   addToCart,
   updateQuantity,
   removeFromCart,
   loadCheckOut,
   loadConfirmation,
   loadOrderFailed,
}