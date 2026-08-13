const WorkingHours = require("../models/workingHours.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const DEFAULT_DAYS = [
    {
        dayShort: 'S',
        dayFull: 'Sunday',
        isAvailable: false,
        startTime: '',
        endTime: ''
    },
    {
        dayShort: 'M',
        dayFull: 'Monday',
        isAvailable: true,
        startTime: '9:00 AM',
        endTime: '6:00 PM'
    },
    {
        dayShort: 'T',
        dayFull: 'Tuesday',
        isAvailable: true,
        startTime: '9:00 AM',
        endTime: '6:00 PM'
    },
    {
        dayShort: 'W',
        dayFull: 'Wednesday',
        isAvailable: true,
        startTime: '9:00 AM',
        endTime: '6:00 PM'
    },
    {
        dayShort: 'T',
        dayFull: 'Thursday',
        isAvailable: true,
        startTime: '9:00 AM',
        endTime: '6:00 PM'
    },
    {
        dayShort: 'F',
        dayFull: 'Friday',
        isAvailable: true,
        startTime: '9:00 AM',
        endTime: '5:00 PM'
    },
    {
        dayShort: 'S',
        dayFull: 'Saturday',
        isAvailable: false,
        startTime: '',
        endTime: ''
    },
];

// fetch working hours
const getWorkingHours = asyncHandler(async (req, res, next) => {
    // serach working hours by the logged in user
    let workingHours = await WorkingHours.findOne({ user: req.user._id });

    // if not exist then create the default working hours
    if (!workingHours) {
        workingHours = await WorkingHours.create({
            user: req.user.id,
            hours: DEFAULT_DAYS,
            selectedDate: [],
        });
    }

    return sendSuccess(res, 200, "Working hours fetch successfuly.", {
        hours: workingHours.hours,
        selectedDates: workingHours.selectedDate,
    });
});


// update working hours
const updateWorkingHours = asyncHandler(async (req, res, next) => {
    const { hours, selectedDate } = req.body;

    const workingHours = await WorkingHours.findOneAndUpdate(
        { user: req.user.id },
        { hours: hours || DEFAULT_DAYS, selectedDate: selectedDate || [] },
        { new: true, upsert: true },
    );

    return sendSuccess(res, 200, 'Workign hours updated successfully.', workingHours);
});

// update calendar type

const syncCalendar = asyncHandler(async (req, res, next) => {
    const { syncedCalendar } = req.body;

    const allowedCalendars = ["Google Calendar", "Outlook Calendar", "Apple Calendar", null];

    if (
        syncedCalendar !== undefined &&
        !allowedCalendars.includes(syncedCalendar)
    ) {
        return next(
            new ApiError("Invalid calendar type selected.", 400)
        );
    }

    let schedule = await WorkingHours.findOne({ user: req.user._id });
    if (!schedule) {
        schedule = new WorkingHours({ user: req.user._id });
    }

    schedule.syncedCalendar = syncedCalendar;
    schedule.isCalendarSynced = Boolean(syncedCalendar);

    await schedule.save();
    return sendSuccess(
        res,
        200,
        `Calendar ${syncedCalendar ? "synced with " + syncedCalendar : "unsynced"} successfully.`,
        {
            syncedCalendar: schedule.syncedCalendar,
            isCalendarSynced: schedule.isCalendarSynced,
        }
    );
});


module.exports = {
    getWorkingHours,
    updateWorkingHours,
    syncCalendar,
}