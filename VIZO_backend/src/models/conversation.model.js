const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    clientRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClientRequest",
        default: null,
    },
    lastMessage: {
        type: String,
        default: "",
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    lastMessageSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    },
}, { timestamps: true });

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
