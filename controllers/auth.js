const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require("../utils/sendEmail");

/**
 *   @desc    Register User
 *   @route   POST /api/v1/auth/register
 *   @access  Public
 */

exports.register = asyncHandler(async (req, res, next) => {
  const {
    body: {
      name,
      email,
      password,
      role
    }
  } = req;

  let user = await User.create({
    name,
    email,
    password,
    role
  });

  if (!user)
    return next(
      new ErrorResponse('There are problem in create password', 401)
    );

  sendTokenResponse(user, 200, res);
});

/**
 *   @desc    Login User
 *   @route   POST /api/v1/auth/login
 *   @access  Public
 */

exports.login = asyncHandler(async (req, res, next) => {
  const {
    body: {
      email,
      password
    }
  } = req;

  if (!email) return next(new ErrorResponse('Please provide an email', 400));
  if (!password)
    return next(new ErrorResponse('Please Provide your password', 400));

  const user = await User.findOne({
    email
  }).select('+password');
  if (!user) return next(new ErrorResponse('This email not found', 401));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

  sendTokenResponse(user, 200, res);
});

/**
 *   @desc    Get current logged in user
 *   @route   POST /api/v1/auth/me
 *   @access  Private
 */

exports.getMe = asyncHandler(async (req, res, next) => {
  const {
    user
  } = req;
  res.status(200).send({
    success: true,
    data: user
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    option.secure = true;
  }

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

/**
 *   @desc    Forgot Password
 *   @route   POST /api/v1/auth/forgetPassword
 *   @access  Public
 */

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const {
    body: {
      email
    }
  } = req;

  const user = await User.findOne({
    email
  });

  if (!user)
    return next(new ErrorResponse('there is no user with that email', 404));

  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Create reset url
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this email becouse you (or someone else) has requested the reset of a password. please make PUT request to :\n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message
    })
    res.status(200).send({
      success: true,
      data: "Email send"
    })
  } catch (error) {
    console.log(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new ErrorResponse("Email could not be send ", 500));
  }
});