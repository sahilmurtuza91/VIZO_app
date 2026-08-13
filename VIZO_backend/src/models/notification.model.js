const mongoose = require("mongoose")


const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    senderName: {
        type: String,
        default: "",
    },
    senderImage: {
        type: String,
        default: "",
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    targetScreen: {
        type: String,
        default: "",
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;