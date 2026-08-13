const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    countryCode: {
        type: String,
        default: '+91'
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
    },
    referredByCode: {
        type: String,
        trim: true,
        default: null,
    },
    myReferralCode: {
        type: String,
        unique: true,
    },
    socialProvider: {
        type: String,
        enum: ['google', 'facebook', 'apple', null],
        default: null,
    },
    socialId: {
        type: String,
        default: null
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    headshotUrl: {
        type: String,
        default: ''
    },
    isPhotoBlurredUntilVerified: {
        type: Boolean,
        default: true
    },

    reDesignations: [{
        type: String,
    }],
    licenseType: {
        type: String,
        default: ""
    },
    licenseNumber: {
        type: String,
        default: "",
    },
    licenseState: {
        type: String,
        default: ""
    },
    licenseDocumentUrl: {
        type: String,
        default: ''
    },
    isLicenseVerified: {
        type: Boolean,
        default: false,
    },
    bio: {
        type: String,
        default: "",
        maxLength: 1000
        ,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    ratingBreakdown: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 },
    },
    experienceYears: {
        type: Number,
        default: 0,
    },
    specialties: [{ type: String }], // flat, residential these types
    languagesSpoken: [{ type: String }],

    currentCity: {
        type: String,
        default: ""
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    profileViewCount: {
        type: Number,
        default: 0
    },
    settings: {
        gpsLocationTracking: {
            type: Boolean,
            default: true
        },
        pushNotifications: {
            type: Boolean,
            default: false
        },
        aiChatbot: {
            type: Boolean,
            default: false
        },
        inAppMessaging: {
            type: Boolean,
            default: false
        },
    },
    notificationPreferences: {
        newClientRequest: {
            type: Boolean,
            default: true
        },
        newMessage: {
            type: Boolean,
            default: true
        },
        reviewsRatings: {
            type: Boolean,
            default: true
        },
        meetingReminders: {
            type: Boolean,
            default: true
        },
        licenseExpiryAlerts: {
            type: Boolean,
            default: true
        },
        platformUpdates: {
            type: Boolean,
            default: false
        },
        marketingPromotions: {
            type: Boolean,
            default: false
        },
    },
    role: {
        type: String,
        enum: ['agent', 'client', 'admin'],
        default: 'agent'
    },
    passwordChangedAt: { type: Date },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true },);

userSchema.index({
    currentLocation: '2dsphere'
});

userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


userSchema.methods.toPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        rating: this.rating,
        reviewCount: this.reviewCount,
        ratingBreakdown: this.ratingBreakdown,
        specialties: this.specialties,
        experience: this.experienceYears,
        isOnline: this.isAvailable,
        avatarUrl: this.avatarUrl,
        bio: this.bio,
        phone: this.phone,
        countryCode: this.countryCode,
        email: this.email,
        languagesSpoken: this.languagesSpoken,
        licenseNumber: this.licenseNumber,
        isLicenseVerified: this.isLicenseVerified,
        currentCity: this.currentCity,
        isProfileComplete: this.isProfileComplete,
        profileViewCount: this.profileViewCount,
    }
}

const User = mongoose.model("User", userSchema);
module.exports = User;