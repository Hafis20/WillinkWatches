const User = require('../models/userModel'); 
const Order = require('../models/ordersModel');
const Product = require('../models/productModel');
const pass = require('../helpers/securePass');
const PDFDocument = require('pdfkit');
const {fs} = require('fs');
const { connections } = require('mongoose');


// Load admin Login page
const loadLogin = async(req,res)=>{
   try {
      res.render('admin-login');
   } catch (error) {
      console.log(error.message);
   }
}

// Verify this is original admin or not 
// Inputs are email and password from the form

const verifyAdmin = async(req,res)=>{
   try {
      const {email,password} = req.body;
      const adminData = await User.findOne({email:email}); // Checking if data is available in database
      if(adminData){
         const isMatch = await pass.checkPassword(password,adminData.password); // if available then we check the password is correct
         if(isMatch){
            if(adminData.is_admin === true){ // if correct then we check it is user or admin
               req.session.admin = adminData;
               res.json({status:'success',message:'Login successfull'}) // if admin redirecting the page
            }else{
               res.json({status:'error',message:'Invalid admin'});;
            }
         }else{
            res.json({status:'error',message:'Incorrect email or password'});
         }
      }else{
         res.json({status:'error',message:'Incorrect email or password'});
      }
   } catch (error) {
      console.log(error.message);
      res.json({status:'error',message:'Server side issue'});
   }
}

// Taking the whole data count
async function oCount(){
   try {
      const orders = await Order.find();

      const count ={
         Delivered:0,
         Placed:0,
         Returned:0,
         Cancelled:0,
         Pending:0,
      }

      orders.forEach((order)=>{
         if(order.orderStatus === 'Delivered'){
            count.Delivered++;
         }else if(order.orderStatus === 'Placed'){
            count.Placed++;
         }else if(order.orderStatus === 'Returned'){
            count.Returned++;
         }else if(order.orderStatus === 'Cancelled'){
            count.Cancelled++;
         }else{
            count.Pending++
         }
      })
      return count;
   } catch (error) {
      console.log(error.message);
   }
}

// Rendering the admin Dashboard
const loadDashboard = async(req,res)=>{
   try {

      const orders = await Order.find();
      // console.log(orders)
      // Finding how many orders we have
      const ordersCount = orders.length;
      const ordCount = await oCount();
      // console.log(ordCount);
      
      // Finding the total revenue
      const deliveredOrders = orders.filter(order=>order.orderStatus === 'Delivered');
      const totalRevenue = deliveredOrders.reduce((acc,order)=>{
         return acc+=order.actualTotalAmount;
      },0);


      // Sending the product Details
      const products = await Product.find().populate('category')
      const productsCount = products.length;
      let category = new Set(products.map(product=>product.category.categoryName));
      const categoryCount = Array.from(category).length;
      
      // Find how many items sell in each products========

      function categoryCounter(products){
   
         const categoryCounts = {};
       
         products.forEach((product) => {
             const categoryName = product.category.categoryName;
             if (categoryCounts[categoryName]) {
                 categoryCounts[categoryName]++;
             } else {
                 categoryCounts[categoryName] = 1;
             }
         });
         return categoryCounts
       }
      
       const cCount = categoryCounter(products);
      //  console.log(cCount)
      // console.log('All products :' ,products.length);
      // console.log('All Categories :' ,categoryCount);


      res.render('adminDashboard',{ordersCount,totalRevenue,productsCount,categoryCount,ordCount,cCount});
   } catch (error) {
      console.log(error.message);
   }
}

// =====Sales Report ====
// Load the sales report page 

const loadSalesReport = async(req,res)=>{
   try{
      const orders = await Order.aggregate([{$match:{orderStatus:'Delivered'}},{$sort:{date:-1}}]);
     
      res.render('sales-report',{orders});
   }catch(error){
      console.log(error.message);
   }
}

// Sales report filtering

const filterSales = async(req,res)=>{
   try {
      const number = req.query.identify
      // Number is 0 === All orders
      // Number is 1 === Today
      // Number is 2 === Weekly
      // Number is 3 === Monthly
      // Number is 4 === Yearly
      // console.log(number)
 
      const today = new Date();
      if(number === '0'){ // All time report

         // Finding data using aggregate
         const orders = await Order.aggregate([{$match:{orderStatus:'Delivered'}},{$sort:{date:-1}}]);
         res.json({orders});

      }else if (number === '1') { // Daily report

         const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
         const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
         // Finding data using aggregate
         const orders = await Order.aggregate([ 
            {
               $match: {
                  orderStatus: 'Delivered',
                  date: {
                     $gte: startOfDay,
                     $lt: endOfDay
                  }
               }
            },
            {$project:{
               date:1,
               actualTotalAmount:1
            }},
            {$sort:{date:-1}}
         ]);
         res.json({ orders });

      }else if(number === '2'){ // Weekly Report

         const currentDay = today.getDay();
         const startofWeek = new Date(today)
         startofWeek.setDate(today.getDate()-currentDay) // We will get the sunday "0"

         const endofWeek = new Date(today)
         endofWeek.setDate(today.getDate() + 6-currentDay); // we will get the saturday it means "6"

         const orders = await Order.aggregate([
            {$match:{
               orderStatus:'Delivered',
               date:{
                  $gte:startofWeek,
                  $lte:endofWeek
               }
            }},
            {$project:{
               date:1,
               actualTotalAmount:1
            }},
            {$sort:{date:-1}}
         ])
         res.json({orders});

      }else if(number === '3'){ // Monthly Report

         // Finding data using aggregate
         const startofMonth = new Date(today.getFullYear(),today.getMonth(),1);
         const endofMonth = new Date(today.getFullYear(),today.getMonth()+1, 0, 23, 59, 59, 999);

         const orders = await Order.aggregate([
            {$match:{
               orderStatus:'Delivered',
               date:{
                  $gte:startofMonth,
                  $lte:endofMonth
               }
            }},
            {$project:{
               date:1,
               actualTotalAmount:1
            }},
            {$sort:{date:-1}}
         ])
         res.json({orders});
      }else if(number ==='4'){ // Yearly Report

         const startOfYear = new Date(today.getFullYear(), 0, 1); // January is 0
         const endOfYear = new Date(today.getFullYear() + 1, 0, 0, 23, 59, 59, 999); // December 31, last millisecond

         const orders = await Order.aggregate([
            {$match:{
               orderStatus:'Delivered',
               date:{
                  $gte:startOfYear,
                  $lte:endOfYear
               }
            }},
            {$project:{
               date:1,
               actualTotalAmount:1
            }},
            {$sort:{date:-1}}
         ])
         res.json({orders});

      }
      // res.render('sales-report')
   } catch (error) {
      console.log(error.message);
   }
}

// Sales report limited in dates

const dateWiseSales = async(req,res)=>{
   try {
      let {startingDate , endingDate} = req.body
      // console.log('Started :',startingDate)
      // console.log('End :',endingDate)
      startingDate = new Date(startingDate);
      endingDate = new Date(endingDate);

      const orders = await Order.aggregate([
         {$match:{
            orderStatus:'Delivered',
            date:{
               $gte:startingDate,
               $lte:endingDate
            }
         }},
         {$project:{
            date:1,
            actualTotalAmount:1
         }},
         {$sort:{date:-1}}
      ])
      res.json({orders});
   } catch (error) {
      console.log(error.message);
   }
}

// Generate sales report in pdf
const generateSalesPdf = async (req, res) => {
   try {
       const doc = new PDFDocument();
       const filename = 'sales-report.pdf';
       const orders = req.body;

       // Set content type to PDF
       res.setHeader('Content-Type', 'application/pdf');
       res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

       // Pipe the PDF kit to the response
       doc.pipe(res);

       // Add content to the PDF
       doc.fontSize(12);
       doc.text('Sales Report', { align: 'center',fontSize: 16 });
       const margin = 10; // 1 inch margin

       doc.moveTo(margin, margin) // Top-left corner (x, y)
       .lineTo(600 - margin, margin) // Top-right corner (x, y)
       .lineTo(600 - margin, 842 - margin) // Bottom-right corner (x, y)
       .lineTo(margin, 842 - margin) // Bottom-left corner (x, y)
       .lineTo(margin, margin) // Back to top-left to close the rectangle
       .lineTo(600 - margin, margin) // Draw line across the bottom edge
       .lineWidth(3)
       .strokeColor('#000000')
       .stroke();
    
      doc.moveDown();
    

       // Define table headers
       const headers = ['Order ID', 'Date', 'Total'];

       // Calculate position for headers
       let headerX = 20;
       let headerY = doc.y + 10;

       // Draw headers
       headers.forEach(header => {
           doc.text(header, headerX, headerY);
           headerX += 220; // Adjust spacing as needed
       });

       // Calculate position for data
       let dataY = headerY + 25;

       // Draw data
       orders.forEach(order => {
           doc.text(order.orderId, 20, dataY);
           doc.text(order.date, 240, dataY);
           console.log(order.totalAmount)
           doc.text(`Rs ${order.totalAmount}`, 460, dataY);
           dataY += 25; // Adjust spacing as needed
       });

       // Finalize the PDF
       doc.end();
   } catch (error) {
       console.log(error.message);
   }
}

//=================================USERS===================================

//Load users list page 

const loadUsersList = async(req,res)=>{
   try {
      const usersData = await User.find({is_admin:false});
      if(usersData){
         res.render('list-users',{users:usersData});
      }
   } catch (error) {
      console.log(error.message);
   }
}

// Load edit Users

const loadEditUsers = async(req,res)=>{
   try {
      const id = req.query.id
      const userData = await User.findById(id);
      if(userData){
         res.render('edit-users',{user:userData});
      }
   } catch (error) {
      console.log(error.message)
   }
}
// Edit users

const editUsers = async(req,res)=>{
   try {
      const {firstName,lastName,id}= req.body;
      if(!firstName){
         res.json({status:'error',message:'First name is required'});
      }
      else if(!lastName){
         res.json({status:'error',message:'Last Name required'})
      }else{
         const usersData = await User.findByIdAndUpdate(id,
            {$set:{
               firstName:firstName,
               lastName:lastName
            }})
            res.json({status:'success',message:'Successfully Updated'})
      }
   } catch (error) {
      console.log(error.message);
      res.json({status:'error',message:'Server side issue'});
   }
}

// Block user
const blockUser = async(req,res)=>{
   try {
      const id = req.query.id;
      const userData = await User.findByIdAndUpdate(id,
         {$set:{
            is_blocked:true
         }})
        res.redirect('/admin/list-users')
   } catch (error) {
      console.log(error.message)
   }
}
// Unblock User
const unBlockUser = async(req,res)=>{
   try {
      const id = req.query.id
      const userData = await User.findByIdAndUpdate(id,
         {$set:{
            is_blocked:false
         }})
         res.redirect('/admin/list-users');
   } catch (error) {
      console.log(error.message);
   }
}


// ======================================ADMIN LOGOUT================================

const logoutAdmin = async(req,res)=>{
   try {
      req.session.admin = null;
      res.redirect('/admin/login');
   } catch (error) {
      console.log(error.message);
   }
}

module.exports = {
   // ====Login=====
   loadLogin,
   verifyAdmin,
   loadDashboard,
   // ==Sales Report
   loadSalesReport,
   filterSales,
   dateWiseSales,
   generateSalesPdf,
   //=====User======
   loadUsersList,
   loadEditUsers,
   editUsers,
   blockUser,
   unBlockUser,
   //======Logout========
   logoutAdmin,
}