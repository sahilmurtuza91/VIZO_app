const mongoose = require("mongoose");

const dailyActivitySchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    category: {
        type: String,
        enum: ['Property Handling', 'Client Meeting', 'Follow Up'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        default: "",
    },
    propertyRef: {
        type: String,
        default: "",
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Ongoing', 'Completed'],
        default: 'Ongoing'
    },
}, { timestamps: true });

const DailyActivity = mongoose.model("DailyActivity", dailyActivitySchema);
module.exports = DailyActivity;