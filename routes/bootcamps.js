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

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const coursesRouter = require('./courses');

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// Re-route into other resource routers
router.use('/:bootcampId/courses', coursesRouter);

router
  .route('/')
  .get(advanceResult(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), postBootcamp);

router
  .route('/:id')
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .get(getBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;
