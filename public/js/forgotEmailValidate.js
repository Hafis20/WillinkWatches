function otpEmailValidate() {
   const email = document.getElementById('email').value;

   let isValid = true;

   if (!validateEmail(email)) {
      document.getElementById('emailError').textContent = 'Enter valid email'
      setTimeout(() => {
         document.getElementById('emailError').textContent = ''
      }, 5000)
      isValid = false;
   }


   // Validate feild is empty or not
   if (email.trim() === '') {
      document.getElementById('emailError').textContent = 'Enter your email'
      setTimeout(() => {
         document.getElementById('emailError').textContent = ''
      }, 5000)
      isValid = false;
   }
   return isValid;
}

// Validating the email
function validateEmail(email) {
   const emailPattern = /^[^\s@]+@gmail.com$/;
   return emailPattern.test(email);
}