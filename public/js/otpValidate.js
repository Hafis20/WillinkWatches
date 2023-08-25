function otpValidate(){
   // otp
   const otp = document.getElementById('otp').value;
   // Error feild
   document.getElementById('otpError').textContent = ''

   let isValid = true

   if(otp.length <6){
      document.getElementById('otpError').textContent = 'Verify your Otp, It contains 6 numbers'
      setTimeout(() => {
      document.getElementById('otpError').textContent = ''
      }, 5000);
      
      isValid = false;
   }

   if(otp.trim() === ''){

      document.getElementById('otpError').textContent = 'Otp is Required'
      setTimeout(() => {
      document.getElementById('otpError').textContent = ''
      }, 5000);
      
      isValid = false;
   }
   return isValid;
}