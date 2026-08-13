const express = require("express");

const router = express.Router();

const {
    getAllNotification,
    createNotification,
    markAllRead,
    markSingleRead,
    deleteNotification
} = require("../controllers/notification.controller");

const { protect } = require("../middlewares/auth");

router.use(protect);

router.route("/")
    .get(getAllNotification)
    .post(createNotification);

router.patch("/mark-all-read", markAllRead);

router.patch("/:id/read", markSingleRead);
router.delete("/:id", deleteNotification);

module.exports = router;