const Referral = require("../models/referral.model");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");


// create referral
const createReferral = asyncHandler(async (req, res, next) => {
    const {
        acceptedByAgent,
        customerName,
        customerLocation,
        propertyType,
        budget,
        referralFeePercent,
        notes,
    } = req.body;

    const allowedPropertyTypes = ["Apartment", "Villa", "House", "Land"];

    if (!customerName || !propertyType) {
        return next(new ApiError("Customer name and property type are required", 400));
    };

    if (!allowedPropertyTypes.includes(propertyType)) {
        return next(
            new ApiError("Property type must be Apartment, Villa, House, or Land.", 400)
        )
    }

    const referral = await Referral.create({
        referringAgent: req.user._id,
        acceptedByAgent: acceptedByAgent || null,
        customerName,
        customerLocation: customerLocation || "",
        propertyType,
        budget: budget !== undefined ? Number(budget) : null,
        referralFeePercent: referralFeePercent !== undefined ? Number(referralFeePercent) : 25,
        notes: notes || "",
        status: "Pending",
    });
    return sendSuccess(res, 201, "Referral created successfully.", referral);
});

// fetch referral
const getReferrals = asyncHandler(async (req, res, next) => {
    const { type, status } = req.query;
    const query = {};

    if (type === "sent") {
        query.referringAgent = req.user._id;
    } else if (type === "received") {
        query.acceptedByAgent = req.user._id;
    } else {
        query.$or = [{ referringAgent: req.user._id }, { acceptedByAgent: req.user._id }];
    }

    if (status) {
        query.status = status;
    }
    const referrals = await Referral.find(query)
        .populate("referringAgent", "name email phone avatarUrl")
        .populate("acceptedByAgent", "name email phone avatarUrl")
        .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Referrals fetched successfully.", referrals);
});

// accept referral
const acceptReferral = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const referral = await Referral.findById(id);

    if (!referral) {
        return next(new ApiError("Referral record not found.", 404));
    }
    if (referral.status !== "Pending") {
        return next(new ApiError(`Referral is already ${referral.status}.`, 400));
    }

    referral.acceptedByAgent = req.user._id;
    referral.status = "Accepted";

    await referral.save();

    return sendSuccess(res, 200, "Referral accepted successfully.", referral);
})

const updateReferralStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status, rewardAmount } = req.body;

    const allowedStatuses = ["Pending", "Accepted", "Under Contract", "Closed"];

    if (!status || !allowedStatuses.includes(status)) {
        return next(
            new ApiError("Valid status (Pending, Accepted, Under Contract, Closed) is required.", 400)
        );
    }

    const referral = await Referral.findOne({
        _id: id,
        $or: [{ referringAgent: req.user._id }, { acceptedByAgent: req.user._id }],
    });

    if (!referral) {
        return next(new ApiError("Referral record not found.", 404));
    }

    referral.status = status;

    if (rewardAmount !== undefined) {
        referral.rewardAmount = Number(rewardAmount);
    }

    await referral.save();

    return sendSuccess(res, 200, `Referral status updated to ${status}.`, referral);
});

module.exports = {
    createReferral,
    getReferrals,
    acceptReferral,
    updateReferralStatus,
}