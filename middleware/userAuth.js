const User = require('../models/userModel');

// For fetch calls
const ftisLogin = async(req,res,next)=>{
   try {
      if(req.session.user){
         const userData = await User.findById(req.session.user._id);
         if(userData && userData.is_blocked){
            delete req.session.user;
            res.json({status:'sessionError',message:'You were Blocked'});
         }else{
            next();
         }
      }else{
         res.json({status:'sessionError',message:'Login required'});
      }
   } catch (error) {
      console.log(error.message)
   }
   
}

const ftisLogout = async(req,res,next)=>{
   try {
      if(req.session.user){
         res.redirect('/home')
      }else{
         next();
      }
   } catch (error) {
      console.log(error.message)
   }
}

// For normal calls

const isLogin = async(req,res,next)=>{
   try {
      if(req.session.user){
         const userData = await User.findById(req.session.user._id);
         if(userData && userData.is_blocked){
            delete req.session.user;
            res.redirect('/login')
         }else{
            next();
         }
      }else{
         res.redirect('/login')
      }
   } catch (error) {
      console.log(error.message)
   }
   
}

const isLogout = async(req,res,next)=>{
   try {
      if(req.session.user){
         res.redirect('/home')
      }else{
         next();
      }
   } catch (error) {
      console.log(error.message)
   }
}


module.exports ={
   isLogin,
   isLogout,
   ftisLogin,
   ftisLogout,
}