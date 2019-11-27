const express = require("express");
const router = express.Router({
    mergeParams: true
});

const Review = require("../models/Review");

const {
    getReviews
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