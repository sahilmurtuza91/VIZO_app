const express = require("express");
const router = express.Router();

const { getWorkingHours, updateWorkingHours, syncCalendar } = require("../controllers/workingHours.controller");
const { protect } = require("../middlewares/auth");

router.use(protect);

router.get("/", getWorkingHours);
router.put("/update", updateWorkingHours);
router.patch("/sync-calendar", syncCalendar);

module.exports = router;