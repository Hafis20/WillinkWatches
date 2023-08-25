function loginValidate(){
   // values
   const email = document.getElementById('email').value
   const password = document.getElementById('password').value
   // Error
   document.getElementById('emailError').textContent =''
   document.getElementById('passwordError').textContent = ''

   let isValid = true;
   // Validate email feild
   if(email.trim() === ''){
      document.getElementById('emailError').textContent = 'Email is required'
      setTimeout(()=>{
      document.getElementById('emailError').textContent = ''
      },5000);
      
      isValid = false
   }

// Validate password feild

   if(password.trim() === ''){
      document.getElementById('passwordError').textContent = 'Password is required'
      setTimeout(()=>{
      document.getElementById('passwordError').textContent = ''
      },5000);
      isValid = false
   }
   return isValid
}