const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamps = require('../models/bootcamps');
const geocoder = require('../utils/geocoder');

/**
 *   @desc    Get all bootcamps
 *   @route   GET /api/v1/bootcamps
 *   @access  Private
 */

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamps.find();
  res.status(200).send({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

/**
 *   @desc    Get single bootcamps
 *   @route   GET /api/v1/bootcamps/:id
 *   @access  Private
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;

  const bootcamp = await Bootcamps.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }
  res.status(200).send({
    success: true,
    data: bootcamp
  });
});

/**
 *   @desc    create single bootcamps
 *   @route   POST /api/v1/bootcamps
 *   @access  Private
 */
exports.postBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await new Bootcamps({
    ...req.body
  });
  await bootcamp.save();
  res.status(201).send({ success: true, data: bootcamp });
});

/**
 *   @desc    update single bootcamps
 *   @route   PUT /api/v1/bootcamps/:id
 *   @access  Private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    body: newData
  } = req;

  const bootcamp = await Bootcamps.findByIdAndUpdate(id, newData, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  res.status(200).send({ success: true, data: bootcamp });
});

/**
 *   @desc    delete single bootcamps
 *   @route   DELETE /api/v1/bootcamps/:id
 *   @access  Private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;

  const bootcamp = await Bootcamps.findByIdAndDelete({ _id: id });
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }
  res.send({
    message: 'delete bootcamps is done',
    data: null
  });
});

/**
 *   @desc    GET bootcamps within radius
 *   @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
 *   @access  Private
 */

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const {
    params: { zipcode, distance }
  } = req;

  // Get lat/lng from geocode
  const loc = await geocoder.geocode(zipcode);
  const [{ latitude: lat, longitude: lng }] = loc;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3.963 mi / 6.378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamps.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).send({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
