const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/course');
const Bootcamp = require('../models/bootcamps');

/**
 *   @desc    Get all courses
 *   @route   GET /api/v1/courses
 *   @route   GET /api/v1/bootcamps/:bootcampId/courses
 *   @access  Public
 */

exports.getCourses = asyncHandler(async (req, res, next) => {
  let courses;
  const {
    params: { bootcampId }
  } = req;

  const { advanceResult } = res;

  if (bootcampId) {
    courses = await Course.find({ bootcamp: bootcampId });
    res.status(200).send({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).send({ ...advanceResult });
  }
});

/**
 *   @desc    Get single course
 *   @route   GET /api/v1/courses/:id
 *   @access  Public
 */

exports.getCourse = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;

  const course = await Course.findById(id).populate({
    path: 'bootcamp'
    // select: 'name description'
  });

  if (!course) return next(new ErrorResponse(`No course with the id of ${id}`), 404);

  res.status(200).send({
    success: true,
    data: course
  });
});

/**
 *   @desc    Add single course
 *   @route   POST /api/v1/bootcamps/:bootcampId/courses
 *   @access  Private
 */

exports.createCourse = asyncHandler(async (req, res, next) => {
  const {
    body,
    params: { bootcampId }
  } = req;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${bootcampId}`, 404));
  }
  const course = await Course.create({ ...body, bootcamp: bootcampId });

  res.status(201).send({
    success: true,
    data: course
  });
});

/**
 *   @desc    update single course
 *   @route   PUT /api/v1/courses/:id
 *   @access  Private
 */

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    body
  } = req;

  let course = await Course.findById(id);
  if (!course)
    return next(new ErrorResponse(`Can not update course because it not found ${id}`, 404));

  course = await Course.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  res.status(200).send({
    success: true,
    data: course
  });
});

/**
 *   @desc    delete single course
 *   @route   DELETE /api/v1/courses/:id
 *   @access  Private
 */

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;

  const course = await Course.findById(id);
  if (!course)
    return next(new ErrorResponse(`Can not delete course because it not found ${id}`, 404));

  await course.remove();

  res.status(200).send({
    success: true,
    data: {}
  });
});
