const express = require("express");
const router = express.Router();

const { sendInvite, getMyInvites, updateInviteReward, getMyReferralLink } = require("../controllers/invite.controller");
const { protect } = require("../middlewares/auth");

router.use(protect);

router.route("/")
    .get(getMyInvites)
    .post(sendInvite);

router.patch("/:id/reward", updateInviteReward);

module.exports = router;