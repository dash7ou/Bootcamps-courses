const express = require('express');
const router = express.Router({ mergeParams: true });
const Course = require('../models/course');
const advanceResult = require('../middleware/advanceResult');
const { protect } = require('../middleware/auth');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

router
  .route('/')
  .get(advanceResult(Course, 'bootcamp'), getCourses)
  .post(protect, createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);
module.exports = router;
