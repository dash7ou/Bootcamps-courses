const express = require("express");
const router = express.Router({
    mergeParams: true
});

const Review = require("../models/Review");

const {
    getReviews,
    getReview,
    createReview
} = require("../controllers/review");

const advanceResults = require("../middleware/advanceResult");
const {
    protect,
    authorize
} = require("../middleware/auth");


router.route("/").get(advanceResults(Review, {
    path: "bootcamp",
    select: "name description"
}), getReviews)

router.route("/:id").get(getReview);
router.route("/").post(protect, authorize('user', 'admin'), createReview);

module.exports = router;