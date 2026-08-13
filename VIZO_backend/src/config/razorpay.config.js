const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id: process.env.TEST_API_KEY,
    key_secret: process.env.TEST_SECRET_KEY,
});
module.exports = razorpayInstance;