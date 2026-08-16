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
    mutedBy:[{ // for the traking of the notification mute
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[],
    }],
    deletedFor:[{ // for the soft delete from the user whose choose clear chat
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[],
    }],
}, { timestamps: true });

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
