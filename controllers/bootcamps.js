/**
 *   @desc    Get all bootcamps
 *   @route   GET /api/v1/bootcamps
 *   @access  public
 */

exports.getBootcamps = (req, res, next) => {
  res.status(200).send({
    success: true
  });
};

/**
 *   @desc    Get single bootcamps
 *   @route   GET /api/v1/bootcamps/:id
 *   @access  public
 */
exports.getBootcamp = (req, res, next) => {
  res.status(200).send({ success: true });
};

/**
 *   @desc    create single bootcamps
 *   @route   POST /api/v1/bootcamps
 *   @access  private
 */
exports.postBootcamp = (req, res, next) => {
  res.status(200).send({ success: true });
};

/**
 *   @desc    update single bootcamps
 *   @route   PUT /api/v1/bootcamps/:id
 *   @access  private
 */
exports.updateBootcamp = (req, res, next) => {
  res.status(200).send({ success: true });
};

/**
 *   @desc    delete single bootcamps
 *   @route   DELETE /api/v1/bootcamps/:id
 *   @access  private
 */
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).send({ success: true });
};
