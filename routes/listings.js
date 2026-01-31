const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing} = require("../middlewares");
const listingController = require("../controllers/listing");
const multer  = require('multer')
const {storage} = require("../cloudConfig");
const upload = multer({ storage })

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("Listing[image]"),
    validateListing,
     wrapAsync(listingController.createListing)
    )
  

//create new Listing:
router.get("/new", isLoggedIn, listingController.newListingForm)

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,
    isOwner,
    upload.single("Listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//edit route:
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editListingForm));


module.exports = router;