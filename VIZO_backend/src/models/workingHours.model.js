const mongoose = require("mongoose");

// this represet a single day and working time
const daySchema = new mongoose.Schema({
    dayShort: {
        type: String,
        required: true,
    },
    dayFull: {
        type: String,
        required: true,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    startTime: {
        type: String,
        default: "",
    },
    endTime: {
        type: String,
        default: ""
    },
}, { _id: true });

// single user whole working hours
const workingHourSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    hours: {
        type: [daySchema],
        default: [],
    },
    selectedDate: [{
        type: String,
    }],
    syncedCalendar: {
        type: String,
        enum: ['Google Calendar', 'Outlook Calendar', 'Apple Calendar', null],
        default: null,
    },
    isCalendarSynced: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const WorkingHours = mongoose.model("WorkingHours", workingHourSchema);
module.exports = WorkingHours;