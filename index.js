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
const PORT = process.env.PORT || 5000;

// User router
const userRouter = require('./routers/userRouter');
app.use('/',userRouter);

app.listen(PORT,()=>console.log(`Server running at port ${PORT}`));
