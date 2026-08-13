const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

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
        });
        conversation = await Conversation.findById(conversation._id)
            .populate("participants", "name email phone avatarUrl isAvailable")
            .populate("clientRequest");
    }
    return sendSuccess(res, 200, "Conversation accessed successfully.", conversation);
});

const getMyConversations = asyncHandler(async (req, res, next) => {
    const conversations = await Conversation.find({
        participants: req.user._id,
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

    conversation.lastMessage = text || (messageType === "video" ? "🎥 Video" : messageType === "image" ? "📷 Image" : "");
    conversation.lastMessageAt = Date.now();
    conversation.lastMessageSender = req.user._id;

    conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== req.user._id.toString()) {
            const currentUnread = conversation.unreadCounts.get(participantId.toString()) || 0;
            conversation.unreadCounts.set(participantId.toString(), currentUnread + 1);
        }
    });
    await conversation.save();
    const populatedMessage = await Message.findById(message._id).populate(
        "sender",
        "name avatarUrl"
    );

    return sendSuccess(res, 201, "Message sent successfully.", populatedMessage);
});
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
    getChatStats,
}