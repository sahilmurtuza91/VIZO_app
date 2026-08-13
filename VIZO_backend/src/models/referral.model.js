const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
    referringAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    acceptedByAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerLocation: {
        type: String,
        default: ""
    },
    propertyType: {
        type: String,
        enum: ['Apartment', 'Villa', 'House', 'Land'],
        required: true
    },
    budget: {
        type: Number,
        default: null,
    },
    referralFeePercent: {
        type: Number,
        default: 25,
    },
    notes: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Under Contract', 'Closed'],
        default: 'Pending'
    },
    rewardAmount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Referral = mongoose.model("Referral", referralSchema);
module.exports = Referral;