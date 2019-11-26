const express = require("express");
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/user");

const User = require("../models/User");

const router = express.Router({
    mergeParams: true
});

const advanceResult = require("../middleware/advanceResult");
const {
    protect,
    authorize
} = require("../middleware/auth");

router.use(protect);
router.use(authorize("admin"));

router.route("/")
    .get(advanceResult(User), getUsers)
    .post(createUser)

router.route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;