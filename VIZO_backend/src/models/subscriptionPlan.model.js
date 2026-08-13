const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Diamond', 'Ruby', 'Sapphire', 'Emerald'],
        required: true,
        unique: true,
    },
    tagLine: {
        type: String,
        default: "",
    },
    monthlyPrice: {
        type: Number,
        required: true,
    },
    annualPricePerMonth: {
        type: Number,
        required: true,
    },
    iconName: {
        type: String,
        enum: ['diamond', 'ruby', 'sapphire', 'emerald'],
        required: true,
    },
    features: [{ type: String }],
    isActive: {
        type: Boolean,
        default: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
module.exports = SubscriptionPlan;
