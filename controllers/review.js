const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Bootcamp = require("../models/bootcamps");
const Review = require("../models/Review");

/**
 *   @desc    Get all reviews
 *   @route   GET /api/v1/reviews
 *   @route   GET /api/v1/bootcamps/:bootcampId/reviews
 *   @access  Public
 */

exports.getReviews = asyncHandler(async (req, res, next) => {
    const {
        params: {
            bootcampId
        }
    } = req;
    const {
        advanceResult
    } = res;

    if (bootcampId) {
        const reviews = await Review.find({
            bootcamp: bootcampId
        });

        res.status(200).send({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).send(advanceResult);
    }
});


/**
 *   @desc    Get all review
 *   @route   GET /api/v1/reviews/:id
 *   @access  Public
 */

exports.getReview = asyncHandler(async (req, res, next) => {
    const {
        params: {
            id
        }
    } = req;

    const review = await Review.findById(id).populate({
        path: "bootcamp",
        select: "name description"
    })

    if (!review) return next(new ErrorResponse("no review with this id", 404));

    res.status(200).send({
        success: true,
        data: review
    })
})