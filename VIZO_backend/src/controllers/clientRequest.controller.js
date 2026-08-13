const ClientRequest = require("../models/clientRequest.model");
const Notification = require("../models/notification.model");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

// get client request on the basis of pending and approved that is status
const getAllRequest = asyncHandler(async (req, res, next) => {
    const { status, intent } = req.query;
    const query = { assignedAgent: req.user._id };
    if (status) {
        query.status = status
    }
    if (intent) query.intent = intent;

    const request = await ClientRequest.find(query)
        .populate("clientUser", "name email phone avatarUrl")
        .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Client requests fetch successfully.', request);
});

// get the client reqeuest of specific user by the help of id.
const getRequestById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const clientRequest = await ClientRequest.findOne({
        _id: id,
        assignedAgent: req.user._id,
    }).populate("clientUser", "name email phone avatarUrl");

    if (!clientRequest) {
        return next(new ApiError("Client request not found.", 404));
    }
    return sendSuccess(res, 200, "Client request details fetched successfully.", clientRequest);
})

// create request
const createRequest = asyncHandler(async (req, res, next) => {
    const {
        name,
        intent,
        address,
        distance,
        selectedSlot,
        clientNotes,
        budgetMin,
        budgetMax,
        propertyType,
        configuration,
        preferredArea,
        lat,
        lng,
    } = req.body;
    if (!name || !intent) {
        return next(new ApiError("Client name and property intent are required.", 400));
    }

    const newRequest = await ClientRequest.create({
        assignedAgent: req.user._id,
        clientUser: req.body.clientUser || null,
        name,
        intent,
        address: address || "",
        distance: distance || "",
        selectedSlot: selectedSlot ? new Date(selectedSlot) : null,
        clientNotes: clientNotes || "",
        budgetMin: budgetMin !== undefined ? Number(budgetMin) : null,
        budgetMax: budgetMax !== undefined ? Number(budgetMax) : null,
        propertyType: propertyType || "",
        configuration: configuration || "",
        preferredArea: preferredArea || "",
        location: {
            type: "Point",
            coordinates: [lng ? Number(lng) : 0, lat ? Number(lat) : 0],
        },
    });

    await Notification.create({
        recipient: newRequest.assignedAgent,
        senderName: newRequest.name,
        senderImage: newRequest.avatarUrl,
        message: `${newRequest.name} sent you a new client request.`,
        targetScreen: "ClientDetailScreen",
        targetId: newRequest._id,
    });

    return sendSuccess(res, 201, 'client request created successfully.', newRequest);
});

const updateRequestStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "approved", "cancelled", "completed"];

    if (!status || !allowedStatuses.includes(status)) {
        return next(new ApiError("Valid status (pending, approved, cancelled, completed) is required.", 400));
    }

    const clientRequest = await ClientRequest.findOne({
        _id: id,
        assignedAgent: req.user._id,
    });

    if (!clientRequest) {
        return next(new ApiError("Client request not found.", 404));
    }

    clientRequest.status = status;
    await clientRequest.save();

    return sendSuccess(res, 200, `Request status updated to ${status}.`, clientRequest);
});

//request for review
const requestReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const clientRequest = await ClientRequest.findOne({
        _id: id,
        assignedAgent: req.user._id,
    });

    if (!clientRequest) {
        return next(new ApiError("Client request not found.", 404));
    }

    clientRequest.isReviewRequested = true;
    clientRequest.reviewRequestedAt = Date.now();
    await clientRequest.save();

    return sendSuccess(res, 200, "Review request sent to client successfully.", clientRequest);
});

module.exports = {
    getAllRequest,
    getRequestById,
    createRequest,
    updateRequestStatus,
    requestReview
}