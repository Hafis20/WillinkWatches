function editProfileValidate(){
   const firstName = document.getElementById('firstName').value;
   const lastName = document.getElementById('lastName').value;
   const email = document.getElementById('userEmail').value;
   const mobile = document.getElementById('mobileNumber').value;

   document.getElementById('firstNameError').textContent = ''
   document.getElementById('lastNameError').textContent = ''
   document.getElementById('emailError').textContent = ''
   document.getElementById('mobileError').textContent = ''

   let isValid = true;
   // First name regex validation
   if(!validateName(firstName)){
      document.getElementById('firstNameError').textContent = 'First letter should be capital';
      document.getElementById('firstName').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('firstName').style.borderColor = ''
         document.getElementById('firstNameError').textContent = ''
      },5000)
      isValid = false;
   }

   // First name feild empty
   if(firstName.trim() === ''){
      document.getElementById('firstNameError').textContent = 'Feild is required';
      document.getElementById('firstName').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('firstName').style.borderColor = ''
         document.getElementById('firstNameError').textContent = ''
      },5000)
      isValid = false;
   }

   // Last name feild empty
   if(lastName.trim() === ''){
      document.getElementById('lastNameError').textContent = 'Feild is required';
      document.getElementById('lastName').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('lastName').style.borderColor = ''
         document.getElementById('lastNameError').textContent = ''
      },5000)
      isValid = false;
   }

   // Email regex validation 
   if(!validateEmail(email)){
      document.getElementById('firstNameError').textContent = 'Enter a valid email';
      document.getElementById('firstName').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('firstName').style.borderColor = ''
         document.getElementById('firstNameError').textContent = ''
      },5000)
      isValid = false;
   }

   // Email feild is empty
   if(email.trim() === ''){
      document.getElementById('emailError').textContent = 'Feild is required';
      document.getElementById('userEmail').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('userEmail').style.borderColor = ''
         document.getElementById('emailError').textContent = ''
      },5000)
      isValid = false;
   }

   // Mobile number regex 
   if(!validateMobile(mobile)){
      document.getElementById('mobileError').textContent = 'Enter a valid mobile number';
      document.getElementById('mobileNumber').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('mobileNumber').style.borderColor = ''
         document.getElementById('mobileError').textContent = ''
      },5000)
      isValid = false;
   }
   // Mobile number feild empty
   if(mobile.trim() === ''){
      document.getElementById('mobileError').textContent = 'Feild is required';
      document.getElementById('mobileNumber').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('mobileNumber').style.borderColor = ''
         document.getElementById('mobileError').textContent = ''
      },5000)
      isValid = false;
   }
   return isValid
}

// First name validation helper function
function validateName(name) {
   const namePattern = /^[A-Z][a-z]*$/;
   return namePattern.test(name);
 }
 
 // Email validation helper function
 function validateEmail(email) {
    const emailPattern = /^[^\s@]+@gmail.com/;
    return emailPattern.test(email);
 }

 // Mobile validation helper function
function validateMobile(mobile) {
   const mobilePattern = /^[0-9]{10}$/;
   return mobilePattern.test(mobile);
}


