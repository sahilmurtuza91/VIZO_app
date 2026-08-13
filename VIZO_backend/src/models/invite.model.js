const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    invitedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    friendName: {
        type: String,
        default: null,
    },
    friendContact: {
        type: String,
        default: null,
    },
    referralStatus: {
        type: String,
        enum: ['Pending', 'Successful'],
        default: 'Pending'
    },
    rewardAmount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model('Invite', inviteSchema);