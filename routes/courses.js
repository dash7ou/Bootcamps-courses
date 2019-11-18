const express = require('express');
const router = express.Router({ mergeParams: true });
const Course = require('../models/course');
const advanceResult = require('../middleware/advanceResult');

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
  .post(createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);
module.exports = router;
