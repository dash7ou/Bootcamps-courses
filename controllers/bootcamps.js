const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamps = require('../models/bootcamps');
const geocoder = require('../utils/geocoder');
const path = require('path');

/**
 *   @desc    Get all bootcamps
 *   @route   GET /api/v1/bootcamps
 *   @access  Private
 */

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const { advanceResult } = res;

  res.status(200).send({
    ...advanceResult
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
  const {
    user: { _id: id, role }
  } = req;

  const bootcampPublished = await Bootcamps.findOne({ user: id });

  if (bootcampPublished && role !== 'admin')
    return next(new ErrorResponse(`The user with id ${id} has already published a bootcamp`, 400));

  const bootcamp = await new Bootcamps({
    ...req.body,
    user: id
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

  const bootcamp = await Bootcamps.findById({ _id: id });
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  await bootcamp.remove();
  res.send({
    message: 'delete bootcamps is done',
    data: {}
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
  // Earth Radius = 3963 mi | 6378 km
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

/**
 *   @desc    upload photo to bootcamps
 *   @route   PUT /api/v1/bootcamps/:id/photo
 *   @access  Private
 */

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    files,
    files: { file },
    files: {
      file: { mimetype, size, name }
    }
  } = req;

  const bootcamp = await Bootcamps.findById(id);
  if (!bootcamp) return next(new ErrorResponse(`no bootcamp with this id ${id}`, 404));

  if (!files) return next(new ErrorResponse(`Please upload a file..`, 400));

  // Make sure file is image
  if (!mimetype.startsWith('image'))
    return next(new ErrorResponse('File uploaded must be an image', 400));

  // Check file size
  if (size > process.env.MAX_FILE_UPLOAD)
    return next(new ErrorResponse('File uploaded very large..', 400));

  // Create Custom filename
  file.name = `photo_${bootcamp._id}${path.parse(name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PHOTO}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem in upload file`, 500));
    }

    await Bootcamps.findByIdAndUpdate(id, { photo: file.name });

    res.status(200).send({
      success: true,
      data: file.name
    });
  });
});
