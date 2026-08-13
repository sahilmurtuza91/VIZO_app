const express = require("express");
const router = express.Router();

const { getActivities, createActivity, updateActivity, deleteActivity, markCompleteActivity } = require("../controllers/dailyActivity.controller");

const { protect } = require("../middlewares/auth");

router.use(protect);

router.route("/")
    .get(getActivities)
    .post(createActivity)

router.route("/:id")
    .put(updateActivity)
    .delete(deleteActivity)
    .patch(markCompleteActivity)

module.exports = router;