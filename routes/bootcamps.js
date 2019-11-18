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

// Include other resource routers
const coursesRouter = require('./courses');

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// Re-route into other resource routers
router.use('/:bootcampId/courses', coursesRouter);
router
  .route('/')
  .get(getBootcamps)
  .post(postBootcamp);

router
  .route('/:id')
  .put(updateBootcamp)
  .get(getBootcamp)
  .delete(deleteBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;
