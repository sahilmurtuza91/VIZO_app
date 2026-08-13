const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth");

router.post("/signup/email", signupWithEmail);
router.post("/signup/phone", signupWithPhone);

router.post("/login/email", loginWithEmail);
router.post("/login/phone", loginWithPhone);

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/social-login", sociallogin);

router.post("/logout", logout);

router.post("/change-password", protect, changePassword);

module.exports = router;