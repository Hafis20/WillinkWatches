function validateForm(){
   // input feilds
   const email = document.getElementById('email');
   const password = document.getElementById('password');

   //Regex
   const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.com$/;


   // Error feilds

   const emailError = document.getElementById('emailError');
   const passwordError = document.getElementById('passwordError');


   //Email feild Empty

   if(email.value.trim() === ""){
      email.style.borderColor = 'red'
      emailError.innerHTML = "Feild is required"
      setTimeout(() => {
         email.style.borderColor = 'grey'
         emailError.innerHTML = ''
      }, 5000);
      return false
   }
   // Email validation

   if(!emailRegex.test(email.value)){
      email.style.borderColor = 'red'
      emailError.innerHTML = "Please Enter a valid email";
      setTimeout(() => {
         email.style.borderColor = 'grey'
         emailError.innerHTML = ""
      }, 5000);
      return false
   }

   // Password empty
   if(password.value.trim() === ""){
      password.style.borderColor = 'red'
      passwordError.innerHTML = "Feild is required"
      setTimeout(() => {
         password.style.borderColor = 'grey'
         passwordError.innerHTML = ''
      }, 5000);
      return false
   }
   return true
}