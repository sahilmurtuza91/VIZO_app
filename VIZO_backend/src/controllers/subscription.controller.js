const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpayInstance = require("../config/razorpay.config");

const SubscriptionPlan = require("../models/subscriptionPlan.model");
const UserSubscription = require("../models/userSubscription.model");
const Payment = require("../models/payment.model");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

// get all the subscription
const getSubscriptionPlan = asyncHandler(async (req, res, next) => {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({ sortOrder: 1, monthlyPrice: 1 });

    return sendSuccess(res, 200, "Subscription plans fetched successfully.", plans);
})


// get the current active subscription

const getCurrentSubscription = asyncHandler(async (req, res, next) => {
    const subscription = await UserSubscription.findOne({
        user: req.user._id,
        status: "active",
    }).populate("plan");

    if (!subscription) {
        return sendSuccess(res, 200, "No active subscription found.", {
            hasActiveSubscription: false,
            subscription: null,
        });
    }
    return sendSuccess(res, 200, "Current active subscription fetched.", {
        hasActiveSubscription: true,
        subscription,
    });
});

const createSubscriptionOrder = asyncHandler(async (req, res, next) => {
    const { planId, billingCycle } = req.body;

    if (!planId) {
        return next(new ApiError("Subscription plan id is required"));
    }

    const selectedCycle = billingCycle === "annual" ? "annual" : "monthly";

    const plan = await SubscriptionPlan.findById(planId);

    if (!plan || !plan.isActive) {
        return next(new ApiError("Subscription plan not found or inactive.", 404));
    }

    let calculatedAmount = 0;
    if (selectedCycle === "annual") {
        calculatedAmount = plan.annualPricePerMonth * 12;
    } else {
        calculatedAmount = plan.monthlyPrice;
    }

    const amountInSubunits = Math.round(calculatedAmount * 100);

    // create order on razorpay 
    const razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInSubunits,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    });

    // store pending user subsscription
    const userSubscription = await UserSubscription.create({
        user: req.user._id,
        plan: plan._id,
        billingCycle: selectedCycle,
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
    });

    await Payment.create({
        user: req.user._id,
        subscription: userSubscription._id,
        razorpayOrderId: razorpayOrder.id,
        amount: calculatedAmount,
        currency: "INR",
        status: "created",
    });

    return sendSuccess(res, 200, "Subscription checkout order created successfully.", {
        orderId: razorpayOrder.id,
        amount: calculatedAmount,
        currency: razorpayOrder.currency,
        keyId: process.env.TEST_API_KEY,
        userSubscriptionId: userSubscription._id,
    });
});

// verify payment and activate the new subscription
const verifySubscriptionPayment = asyncHandler(async (req, res, next) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return next(new ApiError("razorpayOrderId, razorpayPaymentId, and razorpaySignature are required.", 400));
    }

    const subscription = await UserSubscription.findOne({
        razorpayOrderId,
        user: req.user._id,
    });

    if (!subscription) {
        return next(new ApiError("Subscription order record not found.", 404));
    }

    const generatedSignature = crypto
        .createHmac("sha256", process.env.TEST_SECRET_KEY)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

    if (generatedSignature !== razorpaySignature) {
        await Payment.findOneAndUpdate(
            { razorpayOrderId },
            { status: "failed", razorpayPaymentId, razorpaySignature }
        );
        return next(new ApiError("Payment signature verification failed.", 400));
    }

    const startDate = new Date();
    const expiryDate = new Date();

    if (subscription.billingCycle === "annual") {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // update UserSubscriptiom status
    subscription.status = "active";
    subscription.startDate = startDate;
    subscription.expiryDate = expiryDate;
    subscription.razorpayPaymentId = razorpayPaymentId;
    await subscription.save();

    await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: "paid", razorpayPaymentId, razorpaySignature }
    );

    return sendSuccess(res, 200, "Payment verified and subscription activated successfully.", {
        status: subscription.status,
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
    });
});


const seedSubscriptionPlans = asyncHandler(async (req, res, next) => {
    const existingPlans = await SubscriptionPlan.countDocuments();

    if (existingPlans > 0) {
        return sendSuccess(res, 200, "Subscription plans already seeded.");
    }

    const defaultPlans = [
        {
            name: "Diamond",
            tagLine: "Ultimate tier for top performing brokers",
            monthlyPrice: 99,
            annualPricePerMonth: 79,
            iconName: "diamond",
            features: ["Priority Lead Allocation", "Unlimited Showing Requests", "Featured Agent Badge"],
            sortOrder: 1,
        },
        {
            name: "Ruby",
            tagLine: "Advanced plan for growing real estate teams",
            monthlyPrice: 69,
            annualPricePerMonth: 49,
            iconName: "ruby",
            features: ["Advanced Showing Requests", "Direct Client Messaging", "Profile Analytics"],
            sortOrder: 2,
        },
        {
            name: "Sapphire",
            tagLine: "Standard plan for individual agents",
            monthlyPrice: 39,
            annualPricePerMonth: 29,
            iconName: "sapphire",
            features: ["Basic Showing Requests", "Standard Lead Access"],
            sortOrder: 3,
        },
        {
            name: "Emerald",
            tagLine: "Starter plan for new realtors",
            monthlyPrice: 19,
            annualPricePerMonth: 15,
            iconName: "emerald",
            features: ["Community Access", "Basic Profile Listing"],
            sortOrder: 4,
        },
    ];

    const seededPlans = await SubscriptionPlan.insertMany(defaultPlans);
    return sendSuccess(res, 201, "Default subscription plans seeded successfully.", seededPlans);
});

module.exports = {
    getSubscriptionPlan,
    getCurrentSubscription,
    createSubscriptionOrder,
    verifySubscriptionPayment,
    seedSubscriptionPlans,
}