const Order = require('../models/ordersModel');
const Cart = require('../models/cartModel')
const Address = require('../models/addressModel');
const Coupon = require('../models/couponModel');
const userUsedCoupons = require('../models/usedCouponModel');
const Wallet = require('../models/walletModel');
const RazorPayHelper = require('../helpers/razorpayHelper');
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const {Readable} = require('stream')

// Add order
const placeOrder = async(req,res)=>{
   try {
      const user_id = req.session.user._id;
      // Finding the user
      const cart = await Cart.findOne({userId:user_id}).populate('products.productId');

      const {totalAmount,paymentMethod,couponDiscount,actualAmount,addressId,couponId} = req.body;
      // console.log(totalAmount)
      // console.log(paymentMethod)
      // console.log(addressId)
      // console.log(user_id)
      // console.log(cart.products)
      // console.log(couponId)

      //=== Coupon Mangement=====
      if(couponId){
         const usedCoupons = await userUsedCoupons.findOne({userId:user_id});
         if(!usedCoupons){
            usedCoupons = new userUsedCoupons({
               userId:user_id,
               userCoupons:[{couponId:couponId}]
            })
         }else{
            usedCoupons.userCoupons.push({couponId});
         }
         await usedCoupons.save()
      }

      const productData = cart.products;
      let orderedProducts=[];
      productData.forEach(async(product)=>{
         const products ={
            productId:product.productId._id,
            productName:product.productId.productName,
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
         couponDiscount:couponDiscount,
         actualTotalAmount:actualAmount,
         paymentMethod:paymentMethod,
         products:orderedProducts,
         address:address,
      })
      const placedOrder = await orderDetails.save()
      // console.log(placedOrder);

      // Payment method integration 
      // ==== COD====
      if(placedOrder.paymentMethod === 'COD'){
         placedOrder.orderStatus = 'Placed'
         await placedOrder.save();
         if(cart){
            cart.products = [];
            await cart.save();
         }
         // Reducing the product stock
         productData.forEach(async(product)=>{
            product.productId.stock -=product.quantity;
            await product.productId.save()
         })
         res.json({status:'COD',placedOrderId:placedOrder._id})

         // === WALLET===
      }else if(placedOrder.paymentMethod === 'WALLET'){
         // Taking the wallet of user 
         let userWallet = await Wallet.findOne({userId:user_id});
         if(!userWallet){
            userWallet = new Wallet({userId:user_id});
            await userWallet.save();
         }
         const walletAmount = userWallet.walletAmount;
         // console.log('Wallet amount is :',walletAmount)
         if(walletAmount){
            userWallet.walletAmount = walletAmount - actualAmount;
            const amount = (-1*actualAmount);
            userWallet.transactionHistory.push(amount);
            await userWallet.save()
            placedOrder.orderStatus = 'Placed'
            await placedOrder.save();
            if(cart){
               cart.products = [];
               await cart.save();
            }
            productData.forEach(async(product)=>{
               product.productId.stock -=product.quantity;
               await product.productId.save()
            })
            return res.json({status:'WALLET',placedOrderId:placedOrder._id});
         }

         // ===RAZORPAY===
      }else if(placedOrder.paymentMethod === 'RAZORPAY'){
         const orderId = placedOrder._id;
         const totalAmount = placedOrder.actualTotalAmount;
         // Calling razorpay 
         RazorPayHelper.generateRazorPay(orderId,totalAmount).then((response)=>{
            res.json({status:'RAZORPAY',response})
         })
         if(cart){
            cart.products = [];
            await cart.save();
         }
         productData.forEach(async(product)=>{
            product.productId.stock -=product.quantity;
            await product.productId.save()
         })

      }
   } catch (error) {
      console.log(error.message);
   }
}

// Verify online payment
const verifyOnlinePayment = async(req,res)=>{
   const data = req.body
   console.log(data)
   // console.log('Our orderId : ',req.body.order.receipt);
   let receiptId = data.order.receipt;
   
   RazorPayHelper.verifyOnlinePayment(data).then(()=>{
      console.log('Resolved')
      let paymentSuccess = true;

      RazorPayHelper.updatePaymentStatus(receiptId,paymentSuccess).then(()=>{
         res.json({status:'paymentSuccess',placedOrderId:receiptId});
      })
   }).catch((err)=>{
      console.log('Rejected')
      if(err){
         console.log(err.message);

         let paymentSuccess = false;
         RazorPayHelper.updatePaymentStatus(receiptId,paymentSuccess).then(()=>{
            res.json({status:'paymentFailed',placedOrderId:receiptId})
         })
      }
   })
   
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
      // console.log(orderDetails)
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
      const userWallet = await Wallet.findOne({userId:req.session.user._id});
      if(!userWallet){
         userWallet = new Wallet({userId:req.session.user._id});
         await userWallet.save();
      }
         const amount = (1*orderDetails.actualTotalAmount)
         userWallet.walletAmount += orderDetails.actualTotalAmount;
         userWallet.transactionHistory.push(amount);
         await userWallet.save();

         // console.log(userWallet);
         res.json({status:'success',message:'Order Cancelled'});
      // console.log(orderDetails);
   } catch (error) {
      res.json({status:'error',message:'Something went wrong'});
      console.log(error.message)
   }
}

// Return Order
const returnOrder = async(req,res)=>{
   try {
      const {reason,orderId} = req.body
      // console.log(reason);
      // console.log(orderId)

      const order = await Order.findByIdAndUpdate(orderId,
         {$set:{
            'returnOrderStatus.status':'requested',
            'returnOrderStatus.reason': reason
         }},
         {new:true});
         res.json({status:'success',message:'Request Send'});
      // console.log(order);
   } catch (error) {
      res.json({status:'error',message:'Something went wrong'});
      console.log(error.message);
   }
}

// Invoice
const invoice = async(req,res)=>{
   try {
      const orderId = req.query.orderId;
      const orderDetails = await Order.findById(orderId).populate([
         {
            path:'userId'
         },
         {
            path:'products.productId'
         }
      ]);
      console.log("Result :" , orderDetails)

      const products = orderDetails.products.map(product => ({
         quantity: product.quantity,
         description: product.productId.productName, // Assuming description is available in the order
         price: product.salePrice, // Assuming salePrice is the correct price
         total: orderDetails.totalAmount,
         "tax-rate": 0, // Assuming tax-rate is 0
       }));
      //  console.log(products);

      // To format to the date into simplest form
      const isoDateString = orderDetails.date;
      const isoDate = new Date(isoDateString);
        
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = isoDate.toLocaleDateString("en-US", options);
      // console.log(formattedDate)
      // console.log(orderDetails)
      const data = {
         customize: { 
           //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
         },
         images: {
           // The invoice background
           background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
         },
         // Your own data
         sender: {
           company: "Willink Watches",
           address: "Mudickal P.O Perumbavoor",
           city: "Kochi",
           country: "India",
         },
         client: {
           company: "Customer Address",
           "zip": orderDetails.address.postalCode,
           "city": orderDetails.address.city,
           "address": orderDetails.address.homeAddress +' '+orderDetails.address.street,
           // "custom1": "custom value 1",
           // "custom2": "custom value 2",
           // "custom3": "custom value 3"
         },
         information: {
           // Invoice number
           number:  orderDetails._id,
           // ordered date
           date: formattedDate,
         },
         products: products,
         "bottom-notice": "Happy shopping and visit Willink Watch again",
       };
   
      //  console.log(data)
       const pdfResult = await easyinvoice.createInvoice(data);
      //  console.log(pdfResult)
       const pdfBuffer = Buffer.from(pdfResult.pdf, "base64");
      //  console.log(pdfBuffer)
       // Set HTTP headers for the PDF response
       res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
       res.setHeader("Content-Type", "application/pdf");
   
       // Create a readable stream from the PDF buffer and pipe it to the response
       const pdfStream = new Readable();
       pdfStream.push(pdfBuffer);
      // console.log(pdfStream)

       pdfStream.push(null);
      //  console.log(pdfStream)
   
       pdfStream.pipe(res);
   } catch (error) {
      console.log(error.message);
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
      const orderData = await Order.findById(orderId);

      if(orderData){
         if(orderStatus === 'Returned'){
            orderData.orderStatus = orderStatus;
            orderData.returnOrderStatus.status = 'Approved'

            // Returning the amount into the wallet of user 
            const userWallet = await Wallet.findOne({userId:orderData.userId});
            if(userWallet){
               const amount = (1*orderData.actualTotalAmount);
               userWallet.walletAmount += amount;
               userWallet.transactionHistory.push(amount);
               await userWallet.save();
            }

         }else{
            orderData.orderStatus = orderStatus;
         }
         await orderData.save();
      }
         // console.log(orderData);
      res.json({status:'success',message:'Status Updated'});
   } catch (error) {
      res.json({status:'error',message:'Something went wrong'});
      console.log(error.message)
   }
}

module.exports = {
   placeOrder,
   verifyOnlinePayment,
   listOrders,
   orderDetails,
   cancelOrder,
   returnOrder,
   invoice,
   // admin
   loadOrdersPage,
   adminOrderDetails,
   changeStatus,
}