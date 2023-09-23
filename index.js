// dotenv
const dotenv = require('dotenv');
dotenv.config();

// Database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('connected'))

// Express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000

// Morgan
const logger = require('morgan');
app.use(logger('dev'))

app.set("view engine", "ejs");
app.set("views", "./views/user");

// User router
const userRouter = require('./routers/userRouter');
app.use('/',userRouter);

// Admin Router
const adminRouter = require('./routers/adminRouter');
app.use('/admin',adminRouter);

app.use('*',(req,res)=>{
   res.render('404-error')
})

app.listen(PORT,()=>console.log(`Server running at port ${PORT}`));
