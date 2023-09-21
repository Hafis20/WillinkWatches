function validateForm() {
   const firstName = document.getElementById('firstName').value;
   const lastName = document.getElementById('lastName').value;
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
   const mobile = document.getElementById('mobile').value;

   // Reset error messages
   document.getElementById('fnameError').textContent = '';
   document.getElementById('lnameError').textContent = '';
   document.getElementById('emailError').textContent = '';
   document.getElementById('passwordError').textContent = '';
   document.getElementById('mobileError').textContent = '';

   let isValid = true;

   // Validate first name
   if (!validateName(firstName)) {
    document.getElementById('fnameError').textContent = 'Only first letter should be capital';
    setTimeout(()=>{
      document.getElementById('fnameError').textContent = '';
    },5000);
    isValid = false;
  }

   // Validate the feild is empty
   if (firstName.trim() === '') {
       document.getElementById('fnameError').textContent = 'First name is required.';
       setTimeout(()=>{
         document.getElementById('fnameError').textContent = '';
       },5000);
       isValid = false;
   }

   // Validate last name
   if (lastName.trim() === '') {
       document.getElementById('lnameError').textContent = 'Last name is required.';
       setTimeout(()=>{
         document.getElementById('lnameError').textContent = '';
       },5000);
       isValid = false;
   }

   // Validate email
   if (!validateEmail(email)) {
       document.getElementById('emailError').textContent = 'Please enter a valid email address.';
       setTimeout(()=>{
         document.getElementById('emailError').textContent = '';
       },5000);
       isValid = false;
   }

   // Validate password
   if(email.trim() === ''){
      document.getElementById('emailError').textContent = 'Email is required';
      setTimeout(()=>{
        document.getElementById('emailError').textContent = '';
      },5000);
      isValid = false;
   }

   // Validate password regex
   if (!validatePassword(password)) {
       document.getElementById('passwordError').textContent = 'Please enter a tight password';
       setTimeout(()=>{
         document.getElementById('passwordError').textContent = '';
       },5000);
       isValid = false;
   }
   // Validate feild is empty
   if(password.trim() === ''){
    document.getElementById('passwordError').textContent = 'Password  is required';
    setTimeout(()=>{
      document.getElementById('passwordError').textContent = '';
    },5000);
    isValid = false;
 }

   // Validate mobile
   if (!validateMobile(mobile)) {
       document.getElementById('mobileError').textContent = 'Please enter a valid mobile number.';
       setTimeout(()=>{
         document.getElementById('mobileError').textContent = '';
       },5000);
       isValid = false;
   }

   // Validate feild is empty

   if(mobile.trim() === ''){
    document.getElementById('mobileError').textContent = 'Mobile number  is required';
    setTimeout(()=>{
      document.getElementById('mobileError').textContent = '';
    },5000);
    isValid = false;
 }

   return isValid;
}

// First name validation helper function
 function validateName(name) {
  const namePattern = /^[A-Z][a-z]*$/;
  return namePattern.test(name);
}

// Email validation helper function
function validateEmail(email) {
   const emailPattern = /^[^\s@]+@gmail.com$/;
   return emailPattern.test(email);
}

// Password validation helper function
function validatePassword(password){
   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   return passwordPattern.test(password);
}

// Mobile validation helper function
function validateMobile(mobile) {
   const mobilePattern = /^[0-9]{10}$/;
   return mobilePattern.test(mobile);
}

