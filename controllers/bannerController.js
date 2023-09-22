const Banner = require('../models/bannerModel');


// Listing the banners
const listBanners = async(req,res)=>{
   try {
      const banners = await Banner.find();
      res.render('list-banners',{banners});
   } catch (error) {
      console.log(error.message);
   }
}

// Load the add banner page
const LoadaddBanner = async(req,res)=>{
   try {
      res.render('add-banner')
   } catch (error) {
      console.log(error.message);
   }
}

const addBanner = async(req,res)=>{
   try {
      const {bannerTitle,bannerDescription} = req.body;
      const image = req.file.filename
      console.log(image);
      const bannerData = await Banner.create({
         title:bannerTitle.toUpperCase(),
         description:bannerDescription,
         date:new Date(),
         image:image
      })
      await bannerData.save();
      res.render('add-banner',{message:'Banner Added'});
      // console.log(bannerData);
   } catch (error) {
      console.log(error.message);
   }
}

// Changing banner status
const changeBannerStatus = async(req,res)=>{
   try {
      const bannerId = req.query.bannerId;

      const bannerStatus = await Banner.findById(bannerId);
      // console.log(bannerStatus)
      if(bannerStatus.isListed === true){
         bannerStatus.isListed = false;
         await bannerStatus.save()
      }else{
         bannerStatus.isListed = true;
         await bannerStatus.save()
      }
      res.redirect('/admin/list-banners')
   } catch (error) {
      console.log(error.message);
   }
}

module.exports ={
   listBanners,
   LoadaddBanner,
   addBanner,
   changeBannerStatus,
}