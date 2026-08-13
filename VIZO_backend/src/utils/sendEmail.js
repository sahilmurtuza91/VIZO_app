// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//         },
//     });

//     const mailOptipons = {
//         from: `VIZO App <${process.env.EMAIL_FROM || "noreply@vizo.com"}>`,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         html: options.html,
//     };
//     await transporter.sendMail(mailOptipons);
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: Number(process.env.SMTP_PORT),
//         secure: false,
//         family: 4,
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//         },
//         connectionTimeout: 10000,
//         greetingTimeout: 10000,
//         socketTimeout: 10000,
//     });

//     const mailOptions = {
//         from: `VIZO App <${process.env.EMAIL_FROM}>`,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         html: options.html,
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

const sendEmail = async (options) => {
    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: process.env.EMAIL_FROM,
                to: [options.email],
                subject: options.subject,
                text: options.message,
                html: options.html,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend API Error:", data);

            throw new Error(
                data?.message || "Failed to send email"
            );
        }

        console.log("Email sent successfully:", data.id);

        return data;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

module.exports = sendEmail;