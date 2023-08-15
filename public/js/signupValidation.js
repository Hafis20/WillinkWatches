function validateForm(){
   // input feilds
   const fname = document.getElementById('fname');
   const lname = document.getElementById('lname');
   const email = document.getElementById('email');
   const password = document.getElementById('password');
   const mobile = document.getElementById('mobile')



   //Regex
   const nameRegex = /^[A-Z][a-z]*$/;
   const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.com$/;
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   const mobileRegex = /^[0-9]{10}$/;


   // Error feilds
   const fnameError = document.getElementById('fnameError');
   const lnameError = document.getElementById('lnameError');
   const emailError = document.getElementById('emailError');
   const passwordError = document.getElementById('passwordError');
   const mobileError = document.getElementById('mobileError');




   // Conditions

   // First nameFeild Empty

   if(fname.value.trim() === ""){
      fname.style.borderColor = 'red'
      fnameError.innerHTML = "Feild is required"
      setTimeout(() => {
         fname.style.borderColor = '#fff'
         fnameError.innerHTML = ''
      }, 5000);
      return false
   }
   //First name letter validate

   if(!nameRegex.test(fname.value)){
      fname.style.borderColor = 'red'
      fnameError.innerHTML = "First letter should be capital"
      setTimeout(() => {
         fname.style.borderColor = '#fff'
         fnameError.innerHTML = ''
      }, 5000);
      return false
   }
   // Last nameFeild Empty

   if(lname.value.trim() === ""){
      lname.style.borderColor = 'red'
      lnameError.innerHTML = "Feild is required"
      setTimeout(() => {
         lname.style.borderColor = '#fff'
         lnameError.innerHTML = ''
      }, 5000);
      return false
   }

   //Email feild Empty

   if(email.value.trim() === ""){
      email.style.borderColor = 'red'
      emailError.innerHTML = "Feild is required"
      setTimeout(() => {
         email.style.borderColor = '#fff'
         emailError.innerHTML = ''
      }, 5000);
      return false
   }
   // Email validation

   if(!emailRegex.test(email.value)){
      email.style.borderColor = 'red'
      emailError.innerHTML = "Please Enter a valid email";
      setTimeout(() => {
         email.style.borderColor = '#fff'
         emailError.innerHTML = ""
      }, 5000);
      return false
   }

   // Password empty
   if(password.value.trim() === ""){
      password.style.borderColor = 'red'
      passwordError.innerHTML = "Feild is required"
      setTimeout(() => {
         password.style.borderColor = '#fff'
         passwordError.innerHTML = ''
      }, 5000);
      return false
   }

   // Password validation
   if(!passwordRegex.test(password.value)){
     password.style.borderColor = 'red'
      passwordError.innerHTML = "Password contains eight character with capital-number-symbols";
      setTimeout(() => {
         password.style.borderColor = '#fff'
         passwordError.innerHTML = ""
      }, 5000);
      return false
   }

   // Mobile Feild
   if(mobile.value.trim() === ""){
      mobile.style.borderColor = 'red'
      mobileError.innerHTML = "Feild is required"
      setTimeout(() => {
         mobile.style.borderColor = '#fff'
         mobileError.innerHTML = ''
      }, 5000);
      return false
   }

   // Mobile number validation

   if(!mobileRegex.test(mobile.value)){
      mobile.style.borderColor = 'red'
      mobileError.innerHTML = "Please Enter a valid number";
      setTimeout(() => {
         mobile.style.borderColor = '#fff'
         mobileError.innerHTML = ""
      }, 5000);
      return false
   }
   return true
}