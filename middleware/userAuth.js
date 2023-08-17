const isLogin = async(req,res,next)=>{
   if(req.session.user){
      next();
   }else{
      res.redirect('/login');
   }
}

const isLogout = async(req,res,next)=>{
   if(req.session.user){
      res.redirect('/home')
   }else{
      next();
   }
}

module.exports ={
   isLogin,
   isLogout
}