const Listing = require("../models/listing");
const fetch = require("node-fetch");


module.exports.index = async (req,res)=>{
  const {search} = req.query;
  let allListings;
  if(search){
    allListings = await Listing.find({
      $or:[
        {title: {$regex: search, $options: 'i'}},
        {location: {$regex: search, $options: 'i'}},
        {country: {$regex: search, $options: 'i'}}
      ]
    })
  }else{
    allListings= await Listing.find({})
  }
  if (search && allListings.length === 0) {
  req.flash("error", "No listings found for your search.");
  return res.redirect("/listings");
}

     res.render("./listings/index.ejs",{allListings})
}

module.exports.newListingForm = (req,res)=>{
    res.render("./listings/new.ejs")
}

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews", populate : {path:"author"}}).populate("owner") //reviews in listing will contain all details of reviews instead of just ObjectId now(by using populate)
    if(!listing){
        req.flash("error","Listing does not exist!")
        return res.redirect("/listings")
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing})
}

module.exports.createListing = async (req,res)=>{
    if (!req.body.Listing) {
  req.body.Listing = {};
}

    const location = req.body.Listing.location;

const geoRes = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${location}`,{
      headers: {
        "User-Agent": "wanderlust-app/1.0 (priyanshiraghav05@gmail.com)"
    }
  }
);
if(!geoRes.ok){
    req.flash("error", "Geocoding service is currently unavailable. Please try again later.");
    return res.redirect("/listings/new");
}

const geoData = await geoRes.json();

if (!geoData || geoData.length === 0) {
  req.flash("error", "Invalid location. Please enter a valid place.");
  return res.redirect("/listings/new");
}

const lat = geoData[0].lat;
const lng = geoData[0].lon;

req.body.Listing.geometry = {
  type: "Point",
  coordinates: [lng, lat] // GeoJSON format
};
   let newListing=new Listing(req.body.Listing);
   newListing.owner = req.user._id; //setting owner of listing to currently logged in user

    if(req.file){
        newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
console.log(newListing);
      await newListing.save();
      req.flash("success","Successfully created a new listing!")
    res.redirect("/listings");  
}

module.exports.editListingForm = async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing does not exist!")
        return res.redirect("/listings")
    }
    console.log(listing);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("./listings/edit.ejs",{listing, originalImageUrl}) 
}

module.exports.updateListing = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file != "undefined"){
        listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  await listing.save();
    req.flash("success","listing updated successfully!")
    res.redirect(`/listings/${id}`);    
}

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted successfully!")
    res.redirect("/listings");
}