const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const {
    RE_DESIGNATION_OPTIONS,
    LICENSE_TYPE_OPTIONS,
    STATE_OPTIONS,
} = require("../data/lookupData");

const getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    return sendSuccess(res, 200, "Profile fetched successfully.", user.toPublicProfile());
})

const getPublicProfileById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return next(new ApiError("Agent not found", 404));
    }

    if (req.user._id.toString() !== id) {
        user.profileViewCount = (user.profileViewCount || 0) + 1;
        await user.save();
    }

    return sendSuccess(res, 200, "Profile fetched successfully.", user.toPublicProfile());
});


// setup profile after signup or register
const setupProfile = asyncHandler(async (req, res, next) => {
    const { agentName, reDesignations, licenseType, licenseNumber, state, bio } = req.body;
    const user = req.user;

    if (agentName) user.name = agentName;
    if (licenseType) user.licenseType = licenseType;
    if (licenseNumber) user.licenseNumber = licenseNumber;
    if (state) user.licenseState = state;
    if (bio) user.bio = bio;

    if (reDesignations) {
        user.reDesignations = Array.isArray(reDesignations)
            ? reDesignations
            : typeof reDesignations === "string" && reDesignations.startsWith("[")
                ? JSON.parse(reDesignations)
                : [reDesignations];
    }

    if (req.files) {
        if (req.files.profile && req.files.profile[0]) {
            const uploaded = await uploadToCloudinary(req.files.profile[0].buffer, "vizo/avatars", "image");
            user.avatarUrl = uploaded.secure_url;
        }

        if (req.files.headshot && req.files.headshot[0]) {
            const uploaded = await uploadToCloudinary(req.files.headshot[0].buffer, "vizo/headshots", "image");
            user.headshotUrl = uploaded.secure_url;
        }

        if (req.files.licenseDocument && req.files.licenseDocument[0]) {
            const uploaded = await uploadToCloudinary(req.files.licenseDocument[0].buffer, "vizo/license-docs", "auto");
            user.licenseDocumentUrl = uploaded.secure_url;
        }
    }

    user.isProfileComplete = true;

    await user.save();
    return sendSuccess(res, 200, "Profile setup completed successfully.", user.toPublicProfile());

})

// update user profile
const updateProfile = asyncHandler(async (req, res, next) => {
    const user = req.user;

    const { name, bio, phone, countryCode, email, experienceYears, specialties, languagesSpoken } = req.body;


    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (countryCode !== undefined) user.countryCode = countryCode;
    if (email !== undefined) user.email = email;
    if (experienceYears !== undefined) user.experienceYears = Number(experienceYears);

    // this is because data from teh form data may be comes in the form of json
    if (specialties) {
        user.specialties = Array.isArray(specialties)
            ? specialties
            : typeof specialties === "string" && specialties.startsWith("[")
                ? JSON.parse(specialties)
                : [specialties];
    }

    if (languagesSpoken) {
        user.languagesSpoken = Array.isArray(languagesSpoken)
            ? languagesSpoken
            : typeof languagesSpoken === "string" && languagesSpoken.startsWith("[")
                ? JSON.parse(languagesSpoken)
                : [languagesSpoken];
    }

    if (req.files) {
        if (req.files.avatar && req.files.avatar[0]) {
            const uploaded = await uploadToCloudinary(req.files.avatar[0].buffer, "vizo/avatars", "image");
            user.avatarUrl = uploaded.secure_url;
        }
    }

    await user.save();
    return sendSuccess(res, 200, "Profile updated successfully.", user.toPublicProfile());
});

const toggleAvailability = asyncHandler(async (req, res, next) => {
    const { isAvailable } = req.body;

    req.user.isAvailable = Boolean(isAvailable);
    await req.user.save();

    return sendSuccess(
        res,
        200,
        `Status changes to ${req.user.isAvailable ? "Available" : "offline"}.`,
        { isAvailable: req.user.isAvailable }
    );
});

// update location
const updateLocation = asyncHandler(async (req, res, next) => {
    const { lat, lng, cityLabel } = req.body;

    if (lat === undefined || lng === undefined) {
        return next(new ApiError("Latitude and longitude is required.", 400));
    }

    req.user.currentLocation = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
    };

    if (cityLabel) {
        req.user.currentCity = cityLabel;
    }

    await req.user.save();

    return sendSuccess(res, 200, "Location updated successfully.", {
        currentCity: req.user.currentCity,
        currentLocation: req.user.currentLocation,
    })
});


// update platform settings
const updatePlatformSettings = asyncHandler(async (req, res, next) => {
    const { gpsLocationTracking, pushNotifications, aiChatbot, inAppMessaging } = req.body;

    const settings = req.user.settings || {};

    if (gpsLocationTracking !== undefined) settings.gpsLocationTracking = Boolean(gpsLocationTracking);
    if (pushNotifications !== undefined) settings.pushNotifications = Boolean(pushNotifications);
    if (aiChatbot !== undefined) settings.aiChatbot = Boolean(aiChatbot);
    if (inAppMessaging !== undefined) settings.inAppMessaging = Boolean(inAppMessaging);

    req.user.settings = settings;
    await req.user.save();

    return sendSuccess(res, 200, "Platform settings updated successfully.", req.user.settings);
})

// update notification settings
const updateNotificationSettings = asyncHandler(async (req, res, next) => {
    const prefs = req.user.notificationPreferences || {};
    const allowedKeys = [
        "newClientRequest",
        "newMessage",
        "reviewsRatings",
        "meetingReminders",
        "licenseExpiryAlerts",
        "platformUpdates",
        "marketingPromotions",
    ];

    allowedKeys.forEach((key) => {
        if (req.body[key] !== undefined) {
            prefs[key] = Boolean(req.body[key]);
        }
    });

    req.user.notificationPreferences = prefs;
    await req.user.save();

    return sendSuccess(res, 200, "Notification settings updated successfully.", req.user.notificationPreferences);
})

module.exports = {
    getProfile,
    getPublicProfileById,
    setupProfile,
    updateProfile,
    toggleAvailability,
    updateLocation,
    updatePlatformSettings,
    updateNotificationSettings,
}