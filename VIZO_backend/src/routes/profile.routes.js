const express = require("express");

const router = express.Router();

const {
    getProfile,
    setupProfile,
    updateLocation,
    updateProfile,
    toggleAvailability,
    updateNotificationSettings,
    updatePlatformSettings,
} = require("../controllers/profile.controller");

const {protect} = require("../middlewares/auth");
const upload = require("../middlewares/multer");

router.use(protect);

router.get("/me", getProfile);

router.put(
    "/setup",
    upload.fields([
        { name: "profile", maxCount: 1 },
        { name: "headshot", maxCount: 1 },
        { name: "licenseDocument", maxCount: 1 },
    ]),
    setupProfile
);

router.put("/edit", upload.single("profile"), updateProfile);

router.patch("/availability", toggleAvailability);

router.patch("/location", updateLocation);

router.patch("/platform-settings", updatePlatformSettings);

router.patch("/notification-settings", updateNotificationSettings);

module.exports = router;