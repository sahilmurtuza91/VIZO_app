const { required } = require("joi");
const mongoose = require("mongoose");

const userSubscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true,
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'annual'],
        default: 'monthly',
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'expired', 'cancelled'],
        default: 'pending'
    },
    startDate: {
        type: Date,
        default: null,
    },
    expiryDate: {
        type: Date,
        default: null,
    },
    razorpayOrderId: {
        type: String,
        default: "",
    },
    razorpayPaymentId: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const UserSubscription = mongoose.model("UserSubscription", userSubscriptionSchema);
module.exports = UserSubscription;