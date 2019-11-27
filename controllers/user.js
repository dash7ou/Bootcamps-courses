const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");


/**
 *   @desc    get all users
 *   @route   GET /api/v1/auth/users
 *   @access  Private/Admin
 */

exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advanceResults);
});



/**
 *   @desc    get user
 *   @route   GET /api/v1/auth/users/:id
 *   @access  Private/Admin
 */

exports.getUser = asyncHandler(async (req, res, next) => {
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

exports.createUser = asyncHandler(async (req, res, next) => {
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


/**
 *   @desc    update user
 *   @route   PUT /api/v1/auth/users/:id
 *   @access  Private/Admin
 */


exports.updateUser = asyncHandler(async (req, res, next) => {
    const {
        body,
        params: {
            id
        }
    } = req;

    const user = await User.findByIdAndUpdate(id, {
        ...body
    }, {
        runValidators: true,
        new: true
    });

    res.status(200).send({
        success: true,
        data: user
    });
});

/**
 *   @desc    delete user
 *   @route   DELETE /api/v1/auth/users/:id
 *   @access  Private/Admin
 */


exports.deleteUser = asyncHandler(async (req, res, next) => {
    const {
        params: {
            id
        }
    } = req;

    await User.findByIdAndRemove(id);

    res.status(200).send({
        success: true,
        data: {}
    })
})