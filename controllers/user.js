const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");


/**
 *   @desc    get all users
 *   @route   GET /api/v1/auth/users
 *   @access  Private/Admin
 */

exports.getUsers = asyncHandler((req, res, next) => {
    res.status(200).json(res.advanceResults);
});



/**
 *   @desc    get user
 *   @route   GET /api/v1/auth/users/:id
 *   @access  Private/Admin
 */

exports.getUsers = asyncHandler((req, res, next) => {
    const {
        params: {
            id
        }
    } = req;
    const user = await User.findById(id);
    res.status(200).send({
        success: true,
        data: user
    })
});

/**
 *   @desc    create user
 *   @route   POST /api/v1/auth/users
 *   @access  Private/Admin
 */

exports.createUser = asyncHandler((req, res, next) => {
    const {
        body
    } = req;

    const user = await User.create({
        ...body
    });

    res.status(200).send({
        success: true,
        dat: user
    })
});