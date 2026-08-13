const DailyActivity = require("../models/dailyActivity.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const getActivities = asyncHandler(async (req, res, next) => {
    const { category, status, date } = req.query;
    const query = { agent: req.user._id };

    if (category) {
        query.category = category;
    }

    if (status) query.status = status;

    if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        query.date = { $gte: startDate, $lte: endDate };
    }

    const activities = await DailyActivity.find(query)
        .sort({ date: -1 });

    return sendSuccess(res, 200, "Daily activities fetched successfully.", activities);

});

// create daily activity
const createActivity = asyncHandler(async (req, res, next) => {
    const { category, title, clientName, propertyRef, date, status } = req.body;

    const allowedCategories = ["Property Handling", "Client Meeting", "Follow Up"];

    if (!category || !allowedCategories.includes(category)) {
        return next(new ApiError("Valid category (Property Handling, Client Meeting, Follow Up) is required.", 400))
    }

    if (!title || !date) {
        return next(new ApiError("Title and date are required.", 400));
    }

    const activity = await DailyActivity.create({
        agent: req.user._id,
        category,
        title,
        clientName: clientName || "",
        propertyRef: propertyRef || "",
        date: new Date(date),
        status: status || "Ongoing",
    });
    return sendSuccess(res, 201, "Daily activity logged successfully.", activity);
});

// update daily activity
const updateActivity = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { category, title, clientName, propertyRef, date, status } = req.body;

    const activity = await DailyActivity.findOne({
        _id: id,
        agent: req.user._id,
    });

    if (!activity) {
        return next(new ApiError('Daily activity log not found.', 404));
    }

    if (category) activity.category = category;
    if (title) activity.title = title;
    if (clientName !== undefined) activity.clientName = clientName;
    if (propertyRef !== undefined) activity.propertyRef = propertyRef;
    if (date) activity.date = new Date(date);
    if (status) activity.status = status;

    await activity.save();
    return sendSuccess(res, 200, "Daily activity updated successfully.", activity);
});

// delete daily activity
const deleteActivity = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const activity = await DailyActivity.findOneAndDelete({
        _id: id,
        agent: req.user._id,
    });

    if (!activity) {
        return next(new ApiError('Daily activity log not found.', 404));
    }

    return sendSuccess(res, 200, "Daily activity deleted successfully.");
});

const markCompleteActivity = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const activity = await DailyActivity.findOne({
        _id: id,
        agent: req.user._id,
    });

    if (!activity) {
        return next(new ApiError('Daily activity log not found.', 404));
    }

    activity.status = "Completed";
    await activity.save();

    return sendSuccess(
        res,
        200,
        "Daily activity marked as completed successfully.",
        activity
    );
});

module.exports = {
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    markCompleteActivity
}