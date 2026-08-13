const crypto = require("crypto");

const User = require("../models/user.model");
const Otp = require("../models/Otp.model");

const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const sendSms = require("../utils/sendSms");
const buildOtpEmailHtml = require("../utils/otpEmailTemplate");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/AsyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const generateToken = require("../utils/generateToken");

const { countriesData } = require('../data/lookupData')
const { verifyGoogleToken, verifyFacebookToken, verifyAppleToken } = require("../utils/socialAuth");

const isValidCountryCode = (code) => {
    return countriesData.some((country) => `+${country.phoneCode}` === code);
};

const normalizeEmail = (email) => (email || "").trim().toLowerCase();
const normalizeIdentifier = (identifier) => {
    const raw = (identifier || "").trim();
    return raw.includes("@") ? raw.toLowerCase() : raw;
};


const createAndSendOTP = async (identifier, purpose, viaEmail) => {
    const otpCode = generateOtp(4);

    await Otp.deleteMany({ identifier, purpose }); // delete previous otp

    await Otp.create({
        identifier,
        otp: otpCode,
        purpose,
    });

    if (viaEmail) {
        await sendEmail({
            email: identifier,
            subject: 'VIZO - Your verification code',
            message: `Your VIZO OTP code : ${otpCode}. Expires in 5 minutes.`,
            html: buildOtpEmailHtml(otpCode, purpose === "forgot_password" ? "reset your password" : "verify your account"),
        })
    } else {
        await sendSms(identifier, `Your VIZO verification code is: ${otpCode}`);
    }
    return otpCode;
};

const sendTokenResponse = (user, statusCode, res, message) => {
    const token = generateToken(user._id);

    return sendSuccess(res, statusCode, message, {
        token,
        user: user.toPublicProfile(),
    })
}

const generateReferralCode = (name = "") => {
    const prefix = (name || "VZ").substring(0, 3).toUpperCase();
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `${prefix}${randomHex}`;
};

const signupWithEmail = asyncHandler(async (req, res, next) => {
    const email = normalizeEmail(req.body.email);

    if (!email) {
        return next(new ApiError("Email is required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError("User already exit with this email", 400));
    }
    await createAndSendOTP(email, "signup", true);
    return sendSuccess(res, 200, "OTP send to your email.", { email });
})


const signupWithPhone = asyncHandler(async (req, res, next) => {
    const { countryCode, phoneNumber } = req.body;
    if (!phoneNumber) {
        return next(new ApiError("Phone number is required .", 400));
    }

    if (countryCode && !isValidCountryCode(countryCode)) {
        return next(new ApiError("invalud countrycode", 400));
    }

    const existingUser = await User.findOne({ phone: phoneNumber });
    if (existingUser) {
        return next(new ApiError("User already exists with this phone number. Please login.", 400));
    }

    const fullNumber = `${countryCode || "+91"}${phoneNumber}`;
    await createAndSendOTP(fullNumber, "signup", false);

    return sendSuccess(res, 200, "OTP sent to you phone.", { phone: phoneNumber });
});


const loginWithEmail = asyncHandler(async (req, res, next) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
        return next(new ApiError("Email aur password are required.", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        return next(new ApiError("Email or password is worng.", 401));
    }

    if (!user.isEmailVerified) {
        await createAndSendOTP(email, "login", true);
        return next(new ApiError("Email not verified yet. We've sent a new OTP to your email.", 403));
    }

    return sendTokenResponse(user, 200, res, "Login successful.");
});

const loginWithPhone = asyncHandler(async (req, res, next) => {
    const { countryCode, phoneNumber } = req.body;

    if (!phoneNumber) {
        return next(new ApiError("Phone number is required.", 400));
    }

    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
        return next(new ApiError(" user not found first reginster.", 404));
    }

    const fullNumber = `${countryCode || user.countryCode}${phoneNumber}`;
    await createAndSendOTP(fullNumber, "login", false);

    return sendSuccess(res, 200, "otp sent to you phone.", { phone: phoneNumber });
});

const verifyOtp = asyncHandler(async (req, res, next) => {
    const { otp, purpose, password, countryCode, referralCode } = req.body;
    const identifier = normalizeIdentifier(req.body.identifier);

    if (!identifier || !otp || !purpose) {
        return next(new ApiError("identifier, otp and purpose is required", 400));
    }

    const otpRecord = await Otp.findOne({ identifier, purpose }).sort({ createdAt: -1 });

    if (!otpRecord) {
        return next(new ApiError("OTP invalid or expire.", 400));
    }

    if (otpRecord.otp !== otp) {
        return next(new ApiError("invalid otp", 400));
    }

    if (purpose === "forgot_password") {
        return sendSuccess(res, 200, "OTP verify", {
            identifier,
            verified: true,
        });
    }
    const isPhoneIdentifier = identifier.startsWith("+");
    const plainPhone = isPhoneIdentifier ? identifier.replace(/^\+\d{1,3}/, "") : null;

    // now create user in db
    if (purpose === "signup") {
        let existingUser = await User.findOne(
            isPhoneIdentifier ? { phone: plainPhone } : { email: identifier }
        );

        if (existingUser) {
            return next(new ApiError("User already registered.", 400));
        }

        if (!isPhoneIdentifier && !password) {
            return next(new ApiError("Password is required to complete email signup.", 400));
        }

        const newUser = await User.create({
            email: isPhoneIdentifier ? undefined : identifier,
            phone: isPhoneIdentifier ? plainPhone : (req.body.phone || undefined),
            countryCode: countryCode || "+91",
            password: password || undefined,
            isEmailVerified: !isPhoneIdentifier,
            isPhoneVerified: isPhoneIdentifier,
            referredByCode: referralCode || null,
            myReferralCode: generateReferralCode(identifier),
        });

        return sendTokenResponse(newUser, 201, res, "Registration and verification successful.");
    }

    if (purpose === "login") {
        const user = await User.findOne(
            isPhoneIdentifier ? { phone: plainPhone } : { email: identifier }
        );
        if (!user) {
            return next(new ApiError("User not found.", 404));
        }

        if (isPhoneIdentifier) {
            user.isPhoneVerified = true;
        } else {
            user.isEmailVerified = true;
        }
        await user.save();
        return sendTokenResponse(user, 200, res, "Verification and login successful.");
    }

    return next(new ApiError("Invalid purpose provided.", 400));
});


const resendOtp = asyncHandler(async (req, res, next) => {
    const { purpose, viaEmail } = req.body;
    const identifier = normalizeIdentifier(req.body.identifier);

    if (!identifier || !purpose) {
        return next(new ApiError("identifier aur purpose required", 400));
    }

    await createAndSendOTP(identifier, purpose, Boolean(viaEmail));
    return sendSuccess(res, 200, "OTP resend successfully.");
});


const forgotPassword = asyncHandler(async (req, res, next) => {
    const email = normalizeEmail(req.body.email);

    if (!email) {
        return next(new ApiError("Emal is required.", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError("user not fount via this email", 404));
    }

    await createAndSendOTP(email, "forgot_password", true);
    return sendSuccess(res, 200, "Password otp verification is send to you email.", { email });
});

const resetPassword = asyncHandler(async (req, res, next) => {
    const email = normalizeEmail(req.body.email);
    const { newPassword } = req.body;

    if (!email || !newPassword) {
        return next(new ApiError("Email ans newPassword are required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    return sendTokenResponse(user, 200, res, "Password set successfully .");
});

const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new ApiError("Old password and new password are required.", 400));
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        return next(new ApiError("User not found.", 404));
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        return next(new ApiError("Incorrect old password.", 400));
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    return sendSuccess(res, 200, "Password changed successfully.");
})

const sociallogin = asyncHandler(async (req, res, next) => {
    const { provider, idToken, accessToken, identityToken, fullName } = req.body;

    if (!provider) {
        return next(new ApiError("Provider is required(google, facebook, apple", 400));
    }

    let verifiedData;

    if (provider === "google") {
        verifiedData = await verifyGoogleToken(idToken);
    } else if (provider === "facebook") {
        verifiedData = await verifyFacebookToken(accessToken);
    } else if (provider === "apple") {
        verifiedData = await verifyAppleToken(identityToken);
        if (fullName) verifiedData.name = fullName;
    } else {
        return next(new ApiError("Provider should be only google, facebook, apple.", 400));
    }

    const { socialId, email, name } = verifiedData;

    let user = await User.findOne({ socialProvider: provider, socialId });

    if (!user && email) {
        user = await User.findOne({ email });
    }

    if (!user) {
        user = await User.create({
            email: email || undefined,
            name: name || "",
            socialProvider: provider,
            socialId,
            isEmailVerified: Boolean(email),
            myReferralCode: generateReferralCode(name || email || socialId),
        });
    } else {
        user.socialProvider = provider;
        user.socialId = socialId;
        if (email) user.isEmailVerified = true;
        await user.save();
    }
    return sendTokenResponse(user, 200, res, "Social login successful.");
})

const logout = asyncHandler(async (req, res) => {
    return sendSuccess(res, 200, "Logout successful.");
});

module.exports = {
    signupWithEmail,
    signupWithPhone,
    loginWithEmail,
    loginWithPhone,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    changePassword,
    sociallogin,
    logout,
};