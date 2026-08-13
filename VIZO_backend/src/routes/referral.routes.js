const express = require("express");

const router = express.Router();

const { createReferral, getReferrals, acceptReferral, updateReferralStatus } = require("../controllers/referral.controller");

const { protect } = require("../middlewares/auth");

router.use(protect);

router.route("/")
    .get(getReferrals)
    .post(createReferral);

router.patch("/:id/accept",acceptReferral);
router.patch("/:id/status", updateReferralStatus);

module.exports = router;