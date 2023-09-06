function addressValidate(){

   // Taking form data
   const name = document.getElementById('name').value;
   const mobile = document.getElementById('mobileNumber').value;
   const address = document.getElementById('address').value;
   const street = document.getElementById('street').value;
   const city = document.getElementById('city').value;
   const pcode = document .getElementById('pcode').value;

   // Error feilds

   document.getElementById('nameError').textContent = '';
   document.getElementById('mobileError').textContent = '';
   document.getElementById('addressError').textContent = '';
   document.getElementById('streetError').textContent = '';
   document.getElementById('cityError').textContent = '';
   document.getElementById('pcodeError').textContent = '';

   // Logic
   let isValid = true;

   // Name feild logic
   if(!validateName(name)){
      document.getElementById('nameError').textContent = 'First letter should be capital';
      document.getElementById('name').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('nameError').textContent = '';
         document.getElementById('name').style.borderColor = ''
      },5000)
      isValid = false;
   }
   // Name feild
   if(name.trim() === ''){
      document.getElementById('nameError').textContent = 'Feild is required';
      document.getElementById('name').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('nameError').textContent = '';
         document.getElementById('name').style.borderColor = ''
      },5000)
      isValid = false;
   }

   // Checking mobile number logic
   if(!validateMobile(mobile)){
      document.getElementById('mobileError').textContent = 'Please enter a valid number';
      document.getElementById('mobileNumber').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('mobileError').textContent = '';
         document.getElementById('mobileNumber').style.borderColor = ''
      },5000)
      isValid = false;
   }

   // Mobile feild
   if(mobile.trim() === ''){
      document.getElementById('mobileError').textContent = 'Feild is required';
      document.getElementById('mobileNumber').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('mobileError').textContent = '';
         document.getElementById('mobileNumber').style.borderColor = ''
      },5000)
      isValid = false;
   }

   // Name feild
   if(address.trim() === ''){
      document.getElementById('addressError').textContent = 'Feild is required';
      document.getElementById('address').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('addressError').textContent = '';
         document.getElementById('address').style.borderColor = ''
      },5000)
      isValid = false;
   }

   // Name feild
   if(street.trim() === ''){
      document.getElementById('streetError').textContent = 'Feild is required';
      document.getElementById('street').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('streetError').textContent = '';
         document.getElementById('street').style.borderColor = ''
      },5000)
      isValid = false;
   }

   // Name feild
   if(city.trim() === ''){
      document.getElementById('cityError').textContent = 'Feild is required';
      document.getElementById('city').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('cityError').textContent = '';
         document.getElementById('city').style.borderColor = ''
      },5000)
      isValid = false;
   }

   // Name feild
   if(pcode.trim() === ''){
      document.getElementById('pcodeError').textContent = 'Feild is required';
      document.getElementById('pcode').style.borderColor = 'red'
      setTimeout(()=>{
         document.getElementById('pcodeError').textContent = '';
         document.getElementById('pcode').style.borderColor = ''
      },5000)
      isValid = false;
   }
   return isValid;
}

// Validation for name
function validateName(name) {
   const namePattern = /^[A-Z][a-z]*$/;
   return namePattern.test(name);
 }
 
// Validation for mobile number
function validateMobile(mobile) {
   const mobilePattern = /^[0-9]{10}$/;
   return mobilePattern.test(mobile);
}