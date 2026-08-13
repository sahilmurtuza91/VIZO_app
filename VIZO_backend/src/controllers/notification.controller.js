const Notification = require("../models/notification.model");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const getAllNotification = asyncHandler(async (req, res, next) => {
    const { isRead } = req.query;
    const query = { recipient: req.user._id };

    if (isRead !== undefined) {
        query.isRead = isRead === "true";
    }

    const notifications = await Notification.find(query).sort({
        createdAt: -1
    });

    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });
    return sendSuccess(res, 200, "Notifications fetched successfully.", {
        unreadCount,
        notifications,
    });
});

const createNotification = asyncHandler(async (req, res, next) => {
    const { recipient, senderName, senderImage, message, targetScreen, targetId } = req.body;

    if (!recipient || !message) {
        return next(new ApiError("Recipient and message are required.", 400));
    }

    const notification = await Notification.create({
        recipient,
        senderName: senderName || "",
        senderImage: senderImage || "",
        message,
        targetScreen: targetScreen || "",
        targetId: targetId || null,
        isRead: false,
    });

    return sendSuccess(res, 201, "Notification created successfully.", notification);
});

const markAllRead = asyncHandler(async (req, res, next) => {
    await Notification.updateMany(
        {
            recipient: req.user.id,
            isRead: false
        },
        { isRead: true },
    );

    return sendSuccess(res, 200, 'All notification marked as read.');
});


const markSingleRead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const notification = await Notification.findOne({
        _id: id,
        recipient: req.user._id,
    });

    if (!notification) {
        return next(new ApiError("Notification not found", 404));
    }
    notification.isRead = true;
    await notification.save();

    return sendSuccess(res, 200, "notification marked as read", notification);
});

// delete notification
const deleteNotification = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
        _id: id,
        recipient: req.user._id,
    });

    if (!notification) {
        return next(new ApiError("Notification not found.", 404));
    }

    return sendSuccess(res, 200, "Notification deleted successfully.");
})

module.exports = {
    getAllNotification,
    createNotification,
    markAllRead,
    markSingleRead,
    deleteNotification,
};