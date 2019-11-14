const express = require('express');
const router = express.Router();

const {
  getBootcamp,
  getBootcamps,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require('../controllers/bootcamps');

router
  .route('/')
  .get(getBootcamps)
  .post(postBootcamp);

router
  .route('/:id')
  .put(updateBootcamp)
  .get(getBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
