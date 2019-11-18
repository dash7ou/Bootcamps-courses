const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

/**
 *   @desc    Register User
 *   @route   POST /api/v1/auth/register
 *   @access  Private
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

  // Create token
  const token = user.getSignedJwtToken();
  res.status(201).send({
    success: true,
    token
  });
});
