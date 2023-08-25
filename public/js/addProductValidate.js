
function addProductValidate(){
   // Data
   const productName = document.getElementById('productName').value;
   const description = document.getElementById('description').value;
   const regularPrice = document.getElementById('regularPrice').value;
   const salePrice = document.getElementById('salePrice').value;

   // Error feilds
   document.getElementById('productNameError').textContent = '';
   document.getElementById('descriptionError').textContent = '';
   document.getElementById('regularPriceError').textContent = '';
   document.getElementById('salePriceError').textContent = '';

   let isValid = true;
   //handling
// Name Regex validation
   if(!validateName(productName)){
      document.getElementById('productNameError').textContent = 'First letter should be capital';
      setTimeout(()=>{
         document.getElementById('productNameError').textContent = '';
      },5000);
      isValid = false
   }
// Letter character strength
   if(productName.length > 21){
      document.getElementById('productNameError').textContent = 'Limit exceeded (max = 20 char)';
      setTimeout(()=>{
         document.getElementById('productNameError').textContent = '';
      },5000);
      isValid = false
   }
// Feild checking
   if(productName.trim() === ''){
      document.getElementById('productNameError').textContent = 'Product name is required';
      setTimeout(()=>{
         document.getElementById('productNameError').textContent = '';
      },5000);
      isValid = false
   }


   // Description feild
   if(description.trim() === ''){
      document.getElementById('descriptionError').textContent = 'Description is required';
      setTimeout(()=>{
         document.getElementById('descriptionError').textContent = '';
      },5000);
      isValid = false
   }

   // Regular price valid price

   if(!validatePrice(regularPrice)){
      document.getElementById('regularPriceError').textContent = 'Price should be a positive number';
      setTimeout(()=>{
         document.getElementById('regularPriceError').textContent = '';
      },5000);
      isValid = false
   }

   // Regular price feild validate
   if(regularPrice.trim()=== ''){
      document.getElementById('regularPriceError').textContent = 'Regular Price is required';
      setTimeout(()=>{
         document.getElementById('regularPriceError').textContent = '';
      },5000);
      isValid = false
   }

   // Sale price valid number
   if(!validatePrice(salePrice)){
      document.getElementById('salePriceError').textContent = 'Price should be a positive number';
      setTimeout(()=>{
         document.getElementById('salePriceError').textContent = '';
      },5000);
      isValid = false
   }

   //Sale price validation
   if(salePrice.trim() === ''){
      document.getElementById('salePriceError').textContent = 'Sale Price is required'
      setTimeout(()=>{
         document.getElementById('salePriceError').textContent = '';
      },5000);
      isValid = false
   }

   return isValid;
}



// Validateproduct name
function validateName(name) {
   const namePattern = /^[A-Z][a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/|\-=\s]*$/;
   return namePattern.test(name);
 }

function validatePrice(price){
   const pricePattern = /^[0-9]*\.?[0-9]+$/
   return pricePattern.test(price);
}