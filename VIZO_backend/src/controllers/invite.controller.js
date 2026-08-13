const Invite = require("../models/invite.model");
const User = require("../models/user.model");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");


const sendInvite = asyncHandler(async (req, res, next) => {
    const { friendName, friendContact } = req.body;

    if (!friendContact) {
        return next(new ApiError("Friend contact (email or phone) is required.", 400));
    }

    const existingUser = await User.findOne({
        $or: [{ email: friendContact }, { phone: friendContact }],
    });

    const invite = await Invite.create({
        invitedBy: req.user._id,
        invitedUser: existingUser ? existingUser._id : null,
        friendName: friendName || "",
        friendContact,
        referralStatus: existingUser ? "Successful" : "Pending",
        rewardAmount: 0,
    });
    return sendSuccess(res, 201, "Invitation logged successfully.", invite);
});

// get user invite and reward summary
const getMyInvites = asyncHandler(async (req, res, next) => {
    const invite = await Invite.find({ invitedBy: req.user._id })
        .populate("invitedUser", "name email phone avatarUrl")
        .sort({ createdAt: -1 });

    const totalRewardsEarned = invite.reduce((acc, curr) => acc + (curr.rewardAmount || 0), 0);

    return sendSuccess(res, 200, "Invites list fetched successfully.", {
        totalInvites: invite.length,
        totalRewardsEarned,
        myReferralCode: req.user.myReferralCode || "",
        invites: invite,
    });
});

const updateInviteReward = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { referralStatus, rewardAmount } = req.body;

    const invite = await Invite.findById(id);

    if (!invite) {
        return next(new ApiError("Invite record not found.", 404));
    }
    if (referralStatus) {
        invite.referralStatus = referralStatus;
    }

    if (rewardAmount !== undefined) {
        invite.rewardAmount = Number(rewardAmount);
    }
    await invite.save();

    return sendSuccess(res, 200, "Invite reward updated successfully.", invite);
});

const getMyReferralLink = asyncHandler(async (req, res) => {
    const code = req.user.myReferralCode;
    const link = `${process.env.CLIENT_URL || 'https://vizo.app'}/invite/${code}`;
    return sendSuccess(res, 200, 'Referral link mil gaya.', { code, link });
});

module.exports = {
    sendInvite,
    getMyInvites,
    updateInviteReward,
    getMyReferralLink
};