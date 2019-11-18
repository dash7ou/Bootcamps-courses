const express = require('express');
const router = express.Router();

const {
  getBootcamp,
  getBootcamps,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/bootcamps');
const advanceResult = require('../middleware/advanceResult');

// Include other resource routers
const coursesRouter = require('./courses');

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// Re-route into other resource routers
router.use('/:bootcampId/courses', coursesRouter);

router
  .route('/')
  .get(advanceResult(Bootcamp, 'courses'), getBootcamps)
  .post(postBootcamp);

router
  .route('/:id')
  .put(updateBootcamp)
  .get(getBootcamp)
  .delete(deleteBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;
