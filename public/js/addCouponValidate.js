function couponValidate(){
   const code = document.getElementById('couponCode').value;
   const discount = document.getElementById('couponDiscount').value; 
   const min = document.getElementById('couponMinAmount').value;
   const max = document.getElementById('couponMaxDiscountAmount').value;
   const expiration = document.getElementById('couponExpiration').value;
   const create = document.getElementById('couponCreated').value;
   const description = document.getElementById('couponDescription').value;

   // Reset error messages and borders
   document.getElementById('couponCodeError').textContent = '';
   document.getElementById('couponDiscountError').textContent = '';
   document.getElementById('couponMinAmountError').textContent = '';
   document.getElementById('couponMaxDiscountAmountError').textContent = '';
   document.getElementById('couponCreatedError').textContent = '';
   document.getElementById('couponExpirationError').textContent = '';
   document.getElementById('couponDescriptionError').textContent = '';
   document.getElementById('couponCode').style.borderColor = '';
   document.getElementById('couponDiscount').style.borderColor = '';
   document.getElementById('couponMinAmount').style.borderColor = '';
   document.getElementById('couponMaxDiscountAmount').style.borderColor = '';
   document.getElementById('couponCreated').style.borderColor = '';
   document.getElementById('couponExpiration').style.borderColor = '';
   document.getElementById('couponDescription').style.borderColor = '';

   let isValid = true;

   if(code.trim() === ''){
      document.getElementById('couponCodeError').textContent = 'Field is required';
      document.getElementById('couponCode').style.borderColor = 'red';
      isValid = false;
   }

   if(discount.trim() === '' || !validatePercentage(discount)){
      document.getElementById('couponDiscountError').textContent = 'Please enter a valid discount';
      document.getElementById('couponDiscount').style.borderColor = 'red';
      isValid = false;
   }

   if(min.trim() === '' || !validatePrice(min)){
      document.getElementById('couponMinAmountError').textContent = 'Please enter a valid minimum amount';
      document.getElementById('couponMinAmount').style.borderColor = 'red';
      isValid = false;
   }

   if(max.trim() === '' || !validatePrice(max)){
      document.getElementById('couponMaxDiscountAmountError').textContent = 'Please enter a valid maximum amount';
      document.getElementById('couponMaxDiscountAmount').style.borderColor = 'red';
      isValid = false;
   }

   if(create.trim() === ''){
      document.getElementById('couponCreatedError').textContent = 'Field is required';
      document.getElementById('couponCreated').style.borderColor = 'red';
      isValid = false;
   }

   if(expiration.trim() === ''){
      document.getElementById('couponExpirationError').textContent = 'Field is required';
      document.getElementById('couponExpiration').style.borderColor = 'red';
      isValid = false;
   }

   if(dateValidate(create, expiration) === false){
      document.getElementById('couponCreatedError').textContent = 'Please check your dates';
      document.getElementById('couponCreated').style.borderColor = 'red';
      document.getElementById('couponExpirationError').textContent = 'Please check your dates';
      document.getElementById('couponExpiration').style.borderColor = 'red';
      isValid = false;
   }

   if(description.trim() === ''){
      document.getElementById('couponDescriptionError').textContent = 'Field is required';
      document.getElementById('couponDescription').style.borderColor = 'red';
      isValid = false;
   }
   if (!isValid) {
      // Set a timeout to reset error messages and border colors after 3 seconds
      setTimeout(() => {
         resetValidationStyles();
      }, 3000);
   }

   return isValid;
}

function dateValidate(create, expiration){
   const created = new Date(create);
   const expire = new Date(expiration);
   return created <= expire;
}

function validatePrice(price){
   const pricePattern = /^[0-9]*\.?[0-9]+$/;
   return pricePattern.test(price);
}

function validatePercentage(percentage){
   const percentagePattern = /^100(\.0{1,2})?$|^\d{0,2}(\.\d{1,2})?$/;
   return percentagePattern.test(percentage);
}


function resetValidationStyles() {
   document.getElementById('couponCodeError').textContent = '';
   document.getElementById('couponDiscountError').textContent = '';
   document.getElementById('couponMinAmountError').textContent = '';
   document.getElementById('couponMaxDiscountAmountError').textContent = '';
   document.getElementById('couponCreatedError').textContent = '';
   document.getElementById('couponExpirationError').textContent = '';
   document.getElementById('couponDescriptionError').textContent = '';
   document.getElementById('couponCode').style.borderColor = '';
   document.getElementById('couponDiscount').style.borderColor = '';
   document.getElementById('couponMinAmount').style.borderColor = '';
   document.getElementById('couponMaxDiscountAmount').style.borderColor = '';
   document.getElementById('couponCreated').style.borderColor = '';
   document.getElementById('couponExpiration').style.borderColor = '';
   document.getElementById('couponDescription').style.borderColor = '';
}
