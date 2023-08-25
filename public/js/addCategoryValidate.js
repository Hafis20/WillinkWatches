function categoryValidate(){

   const categoryName = document.getElementById('name').value;
   const description = document.getElementById('discription').value;

   document.getElementById('categoryNameError').textContent = '';
   document.getElementById('descriptionError').textContent = '';

   let isValid = true;

   if(categoryName.trim() === ''){
      document.getElementById('categoryNameError').textContent = 'Category Name is required';
      setTimeout(()=>{
         document.getElementById('categoryNameError').textContent = '';
      },5000);
      isValid = false
   }

/// Checking feild of discription

   if(description.trim() === ''){
      document.getElementById('descriptionError').textContent = 'Description is required';
      setTimeout(()=>{
         document.getElementById('descriptionError').textContent = '';
      },5000);
      isValid = false
   }
   return isValid
}