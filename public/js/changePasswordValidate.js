function changePasswordValidate(){
   const currentPass = document.getElementById('currentPassword').value;
   const newPass = document.getElementById('newPassword').value;
   const confirmNewPass = document.getElementById('confirmNewPassword').value;

   document.getElementById('currentPassError').textContent = ''
   document.getElementById('newPassError').textContent = ''
   document.getElementById('confirmNewPassError').textContent = ''

   let isValid = true;
   // Current password obey the rules or not , if no! pasword is wrong
   if(!validatePassword(currentPass)){
      document.getElementById('currentPassError').textContent = 'Incorrect Password'
      setTimeout(()=>{
         document.getElementById('currentPassError').textContent = ''
      },5000)
      isValid = false
   }

   // Current Pass 
   if(currentPass.trim() === ''){
      document.getElementById('currentPassError').textContent = 'Feild is required'
      setTimeout(()=>{
         document.getElementById('currentPassError').textContent = ''
      },5000)
      isValid = false
   }
   
   // Checking the new password and confirmation pass is equal or not

   if(newPass !== confirmNewPass){
      document.getElementById('confirmNewPassError').textContent = 'New password not matching'
      setTimeout(()=>{
         document.getElementById('confirmNewPassError').textContent = ''
      },5000)
      isValid = false
   }

   // Checking password regex

   if(!validatePassword(newPass)){
         document.getElementById('newPassError').textContent = 'Password must be tight'
         setTimeout(()=>{
            document.getElementById('newPassError').textContent = ''
         },5000)
         isValid = false
      }

   // New Pass
   if(newPass.trim() === ''){
      document.getElementById('newPassError').textContent = 'Feild is required'
      setTimeout(()=>{
         document.getElementById('newPassError').textContent = ''
      },5000)
      isValid = false
   }

   // Confirm new Pass
   if(confirmNewPass.trim() === ''){
      document.getElementById('confirmNewPassError').textContent = 'Feild is required'
      setTimeout(()=>{
         document.getElementById('confirmNewPassError').textContent = ''
      },5000)
      isValid = false
   }

   return isValid
}


// Password validation helper function
function validatePassword(password){
   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   return passwordPattern.test(password);
}

