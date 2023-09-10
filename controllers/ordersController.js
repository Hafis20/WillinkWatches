const Order = require('../models/ordersModel');
const Cart = require('../models/cartModel')
const Address = require('../models/addressModel');

// Add order
const placeOrder = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      // Finding the user
      const cart = await Cart.findOne({userId:user_id}).populate('products.productId');

      const {totalAmount,paymentMethod,addressId} = req.body;
      // console.log(totalAmount)
      // console.log(paymentMethod)
      // console.log(addressId)
      // console.log(user_id)
      // console.log(cart.products)

      const productData = cart.products;
      let orderedProducts=[];
      productData.forEach((product)=>{
         const products ={
            productId:product.productId._id,
            quantity:product.quantity,
            salePrice:product.productId.salePrice,
            total:product.total
         }
         orderedProducts.push(products);
      })
      // console.log(orderedProducts)


      const userAddress = await Address.findOne({userId:user_id})
      const shippingAddress = userAddress.address.find(address=>address._id.toString()===addressId);
      // console.log(shippingAddress)

      // Address --
      const address = {
         name:shippingAddress.name,
         mobile:shippingAddress.mobile,
         homeAddress:shippingAddress.homeAddress,
         city:shippingAddress.city,
         street:shippingAddress.street,
         postalCode:shippingAddress.postalCode
      }
      // console.log(address);

      const orderDetails = new Order({
         userId:user_id,
         totalAmount:totalAmount,
         paymentMethod:paymentMethod,
         products:orderedProducts,
         address:address,
      })
      const placedOrder = await orderDetails.save()
      console.log(placedOrder._id);

      if(cart){
         cart.products = [];
         await cart.save();
      }
      res.json({status:'success',placedOrderId:placedOrder._id});
   } catch (error) {
      console.log(error.message);
   }
}

// List orders in user-side
const listOrders = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      const userOrders = await Order.find({userId:user_id}).populate('products.productId');
      res.render('list-orders',{userOrders});
   } catch (error) {
      console.log(error.message);
   }
}

// When user click into the details 

const orderDetails = async(req,res)=>{
   try {
      const orderId = req.query.orderId;
      const orderDetails = await Order.findById(orderId).populate('products.productId').sort({date:1})
      console.log(orderDetails)
      res.render('order-details',{orderDetails});
   } catch (error) {
      console.log(error.message);
   }
}

// Cancel order
const cancelOrder = async(req,res)=>{
   try {
      const orderId = req.query.orderId;
      const orderDetails = await Order.findByIdAndUpdate(orderId,
         {$set:{
            orderStatus:'Cancelled'
         }},
         {new:true}
         );
         res.json({status:'success',message:'Order Cancelled'});
      console.log(orderDetails);
   } catch (error) {
      res.json({status:'error',message:'Something went wrong'});
      console.log(error.message)
   }
}

// ==============================Admin Order management=================

// Admin can view the order list
const loadOrdersPage = async(req,res)=>{
   try {
      const orders = await Order.find().populate('userId');
      res.render('list-orders',{orders});
   } catch (error) {
      console.log(error.message);
   }
}

// Admin can view the order specific details
const adminOrderDetails = async(req,res)=>{
   try {
      const orderId = req.query.orderId
      // console.log(orderId);
      const orderDetails = await Order.findById(orderId).populate('products.productId');
      // console.log(orderDetails.products)
      res.render('order-details',{orderDetails});
   } catch (error) {
      console.log(error.message);
   }
}

// Admin can change the order status
const changeStatus = async(req,res)=>{
   try {
      const {orderId, orderStatus} = req.body;
      // console.log(orderId)
      // console.log(orderStatus)
      const orderData = await Order.findByIdAndUpdate(orderId,
         {$set:{
            orderStatus:orderStatus
         }},
         {new:true});
         // console.log(orderData);
      res.json({status:'success',message:'Status Updated'});
   } catch (error) {
      res.json({status:'error',message:'Something went wrong'});
      console.log(error.message)
   }
}

module.exports = {
   placeOrder,
   listOrders,
   orderDetails,
   cancelOrder,
   // admin
   loadOrdersPage,
   adminOrderDetails,
   changeStatus,
}