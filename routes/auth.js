const express = require('express');
const router = express.Router();

const {
    register,
    login,
    getMe,
    forgetPassword,
    resetPassword
} = require('../controllers/auth');

const {
    protect
} = require('../middleware/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/forgetpassword').post(forgetPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);


module.exports = router;