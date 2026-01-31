const express = require("express");
const router = express.Router({mergeParams: true}); // mergerParams to receive the listing id through the route in app.use
const wrapAsync = require("../utils/wrapAsync")
const { validateReview,isLoggedIn, isReviewAuthor} = require("../middlewares");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")

const reviewController = require("../controllers/reviews")

//post review route
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));  
//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;