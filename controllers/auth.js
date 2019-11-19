const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

/**
 *   @desc    Register User
 *   @route   POST /api/v1/auth/register
 *   @access  Public
 */

exports.register = asyncHandler(async (req, res, next) => {
  const {
    body: { name, email, password, role }
  } = req;

  let user = await User.create({
    name,
    email,
    password,
    role
  });

  if (!user) return next(new ErrorResponse('There are problem in create password', 401));

  sendTokenResponse(user, 200, res);
});

/**
 *   @desc    Login User
 *   @route   POST /api/v1/auth/login
 *   @access  Public
 */

exports.login = asyncHandler(async (req, res, next) => {
  const {
    body: { email, password }
  } = req;

  if (!email) return next(new ErrorResponse('Please provide an email', 400));
  if (!password) return next(new ErrorResponse('Please Provide your password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse('This email not found', 401));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    option.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};
