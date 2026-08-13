const twilio = require("twilio");

const sendSms = async(to, message) => {
    try {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.log(`[DEV SMS MOCK] Sent to ${to}: ${message}`);
            return true;
        }

        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
        });
        return true;
    } catch (error) {
        console.error("SMS Sending Error:", error.message);
        throw error;
    }
}

module.exports = sendSms;