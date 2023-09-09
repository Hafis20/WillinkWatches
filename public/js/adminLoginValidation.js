function adminValidate(){
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;

   document.getElementById('emailError').textContent = ''
   document.getElementById('passwordError').textContent = ''

   let isValid = true;

   if(email.trim() === ''){
      document.getElementById('emailError').textContent = 'Feild is required'
      setTimeout(()=>{
         document.getElementById('emailError').textContent = ''
      },3000)
      isValid = false
   }

   if(password.trim()===''){
      document.getElementById('passwordError').textContent = 'Feild is required'
      setTimeout(()=>{
         document.getElementById('passwordError').textContent = ''
      },3000)
      isValid = false
   }
   return isValid;
}