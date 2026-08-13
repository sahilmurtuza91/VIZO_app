const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    identifier: {
        type: String, // email or phone
        required: true,
        index: true,
    },
    otp: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ['signup', 'login', 'forgot_password'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // expire in 5minutes
    },
}, { timestamps: true });

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;