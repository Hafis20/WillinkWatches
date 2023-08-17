const bcrypt = require('bcrypt');

const securePassword = async(password)=>{
   try {
      const hashPassword = await bcrypt.hash(password,10);
      return hashPassword;
   } catch (error) {
      console.log(error.message);
   }
}

const checkPassword = async(password,hashPassword)=>{
   try {
      const isMatch = await bcrypt.compare(password,hashPassword)
      return isMatch
   } catch (error) {
      console.log(error.message);
   }
}


module.exports ={
   securePassword,
   checkPassword
}