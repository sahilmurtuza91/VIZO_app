const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const { getIO } = require("../utils/socketManager");

const accessConversation = asyncHandler(async (req, res, next) => {
    const { receiverId, clientRequestId } = req.body;
    if (!receiverId) {
        return next(new ApiError('Receiver Id is required.', 400));
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] },
    })
        .populate("participants", "name email phone avatarUrl isAvailable")
        .populate("clientRequest");

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user._id, receiverId],
            clientRequest: clientRequestId || null,
            unreadCounts: {
                [req.user._id.toString()]: 0,
                [receiverId.toString()]: 0,
            },
            mutedBy: [],
            deletedFor: [],
        });
        conversation = await Conversation.findById(conversation._id)
            .populate("participants", "name email phone avatarUrl isAvailable")
            .populate("clientRequest");
    } else {
        if (conversation.deletedFor?.includes(req.user._id)) {
            conversation.deletedFor = conversation.deletedFor.filter(
                (id) => id.toString() !== req.user._id.toString()
            );
            await conversation.save();
        }
    }
    return sendSuccess(res, 200, "Conversation accessed successfully.", conversation);
});

const getMyConversations = asyncHandler(async (req, res, next) => {
    const conversations = await Conversation.find({
        participants: req.user._id,
        deletedFor: { $ne: req.user._id }, // hide the cleared chat
    })
        .populate("participants", "name email phone avatarUrl isAvailable")
        .populate("lastMessageSender", "name")
        .populate("clientRequest")
        .sort({ updatedAt: -1 });

    return sendSuccess(res, 200, "Conversations fetched successfully.", conversations);
});

const getMessages = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.user._id,
    })

    if (!conversation) {
        return next(new ApiError("Conversation not found.", 404));
    }

    const messages = await Message.find({ conversation: conversationId })
        .populate("sender", "name avatarUrl")
        .sort({ createdAt: 1 });

    if (conversation.unreadCounts) {
        conversation.unreadCounts.set(req.user._id.toString(), 0);
        await conversation.save();
    }

    return sendSuccess(res, 200, "Message history fetched successfully.", messages);
});

const sendMessage = asyncHandler(async (req, res, next) => {
    const { conversationId, text } = req.body;

    if (!conversationId) {
        return next(new ApiError("Conversation Id is required", 400));
    }


    let imageUrl = "";
    let videoUrl = "";
    let messageType = "text";

    if (req.file) {
        const isVideo = req.file.mimetype.startsWith("video/");
        const uploaded = await uploadToCloudinary(
            req.file.buffer,
            "vizo/chat",
            isVideo ? "video" : "image"
        );
        if (isVideo) {
            videoUrl = uploaded.secure_url;
            messageType = "video";
        } else {
            imageUrl = uploaded.secure_url;
            messageType = "image";
        }
    }

    if (!text && !imageUrl && !videoUrl) {
        return next(new ApiError("Message text, image or video file is required", 400));
    }
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.user._id,
    });

    if (!conversation) {
        return next(new ApiError("Conversation not found", 404));
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: req.user._id,
        text: text || "",
        imageUrl,
        videoUrl,
        messageType,
    });
    const populatedMessage = await Message.findById(message._id).populate("sender", "name avatarUrl");

    conversation.lastMessage = text || (messageType === "video" ? "🎥 Video" : messageType === "image" ? "📷 Image" : "");
    conversation.lastMessageAt = Date.now();
    conversation.lastMessageSender = req.user._id;

    conversation.deletedFor = [];

    conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== req.user._id.toString()) {
            const currentUnread = conversation.unreadCounts?.get(participantId.toString()) || 0;
            conversation.unreadCounts.set(participantId.toString(), currentUnread + 1);
        }
    });

    await conversation.save();
    const io = getIO();
    if (io) {
        io.to(`conversation_${conversationId}`).emit("receive_message", populatedMessage);

        conversation.participants.forEach((participantId) => {
            const isMuted = conversation.mutedBy?.some((id) => id.toString() === participantId.toString());
            if (participantId.toString() !== req.user._id.toString() && !isMuted) {
                io.to(`user_${participantId}`).emit("new_message_notification", {
                    conversationId,
                    senderName: req.user.name,
                    message: text || (messageType === "video" ? "sent a video" : messageType === "image" ? "sent an image" : ""),
                });
            }
        });
    }

    return sendSuccess(res, 201, "Message sent successfully.", populatedMessage);
});

const markAllAsRead = asyncHandler(async (req, res, next) => {
    const userId = req.user._id.toString();
    const conversations = await Conversation.find({ participants: req.user._id });

    for (let conv of conversations) {
        if (conv.unreadCounts && conv.unreadCounts.has(userId)) {
            conv.unreadCounts.set(userId, 0);
            await conv.save();
        }
    }

    return sendSuccess(res, 200, "All conversations marked as read.");
});

const clearConversationMessages = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.user._id,
    });

    if (!conversation) {
        return next(new ApiError("Conversation not found", 404));
    }

    if (!conversation.deletedFor.includes(req.user._id)) {
        conversation.deletedFor.push(req.user._id);
        await conversation.save();
    }
    return sendSuccess(res, 200, "Chat cleared successfully.");
})

const toggleMuteConversation = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.user._id,
    });

    if (!conversation) {
        return next(new ApiError("Conversation not found", 404));
    }

    const userId = req.user._id;
    const isMuted = conversation.mutedBy?.some((id) => id.toString() === userId.toString());

    if (isMuted) {
        conversation.mutedBy = conversation.mutedBy.filter((id) => id.toString() !== userId.toString());
    } else {
        conversation.mutedBy.push(userId);
    }

    await conversation.save();

    return sendSuccess(res, 200, isMuted ? "Conversation unmuted." : "Conversation muted.", {
        isMuted: !isMuted,
    });
})

const getChatStats = asyncHandler(async (req, res, next) => {
    const conversations = await Conversation.find({ participants: req.user._id }).select("_id");
    const conversationIds = conversations.map((c) => c._id);

    const totalMessages = await Message.countDocuments({ conversation: { $in: conversationIds } });

    return sendSuccess(res, 200, "Chat stats fetched successfully.", { totalMessages });
});

module.exports = {
    accessConversation,
    getMyConversations,
    getMessages,
    sendMessage,
    markAllAsRead,
    clearConversationMessages,
    toggleMuteConversation,
    getChatStats,
}