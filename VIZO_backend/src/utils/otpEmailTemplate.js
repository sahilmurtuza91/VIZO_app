const buildOtpEmailHtml = (otpCode, purposeLabel = "reset your password", userName = "") => {
    const digits = otpCode.toString().split("");
    const recipientName = userName ? `Hello <strong>${userName}</strong>,` : "Hello,";

    let headingTitle = "Verify Your Identity";
    let subTitle = "Secure Verification Code";

    if (purposeLabel.includes("reset")) {
        headingTitle = "Reset Your Password";
        subTitle = "Password Recovery Request";
    } else if (purposeLabel.includes("login")) {
        headingTitle = "Account Security Verification";
        subTitle = "Two-Factor Authentication";
    } else if (purposeLabel.includes("register") || purposeLabel.includes("signup") || purposeLabel.includes("email")) {
        headingTitle = "Verify Your Email Address";
        subTitle = "Account Activation";
    }

    // Individual glowing digit boxes (Single Row Safe)
    const digitBoxesHtml = digits.map((digit) => `
        <td align="center" style="padding: 0 4px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="46" style="width: 46px;">
                <tr>
                    <td align="center" height="54" style="background: #18181B; border: 1px solid #3F3F46; border-radius: 10px; height: 54px; text-align: center; color: #FF7A00; font-size: 26px; font-weight: 800; font-family: 'SF Pro Display', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, monospace;">
                        ${digit}
                    </td>
                </tr>
            </table>
        </td>
    `).join("");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${headingTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 40px 15px;">
        <tr>
            <td align="center">

                <!-- Main Card Container (Max Width 580px) -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #121214; border-radius: 18px; border: 1px solid #27272A; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">

                    <!-- Header Banner with Gradient Accent -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #FF1616 0%, #FF7A00 100%); padding: 32px 24px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; color: #FFFFFF; font-size: 32px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
                                            VIZO
                                        </h1>
                                        <p style="margin: 6px 0 0 0; color: rgba(255, 255, 255, 0.88); font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                                            ${subTitle}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 38px 36px 20px 36px;">

                            <h2 style="margin: 0 0 16px 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                                ${headingTitle}
                            </h2>

                            <p style="margin: 0 0 12px 0; font-size: 15px; color: #D4D4D8; line-height: 1.7;">
                                ${recipientName}
                            </p>

                            <p style="margin: 0 0 28px 0; font-size: 15px; color: #A1A1AA; line-height: 1.7;">
                                To ${purposeLabel}, please use the one-time verification code provided below.
                            </p>

                            <!-- OTP Box Card -->
                            <div style="text-align: center; margin: 30px 0 24px 0;">
                                <p style="margin: 0 0 12px 0; color: #71717A; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                                    One-Time Password (OTP)
                                </p>

                                <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                                    <tr>
                                        ${digitBoxesHtml}
                                    </tr>
                                </table>
                            </div>

                            <!-- Expiry Alert -->
                            <div style="text-align: center; margin-bottom: 28px;">
                                <p style="margin: 0; font-size: 13px; color: #A1A1AA;">
                                    ⏱️ This code will expire in <strong style="color: #FF7A00;">5 minutes</strong>.
                                </p>
                            </div>

                            <!-- Security Notice Box -->
                            <div style="background-color: #18181B; border-left: 4px solid #FF7A00; border-radius: 8px; padding: 16px 18px; margin-top: 10px;">
                                <p style="margin: 0; color: #E4E4E7; font-size: 13px; line-height: 1.6;">
                                    <strong style="color: #FFFFFF;">Security Notice:</strong>
                                    VIZO representatives will never ask for your verification code via phone call, SMS, or direct chat. Never share this code with anyone.
                                </p>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #0E0E10; padding: 24px 36px; border-top: 1px solid #1F1F23;">
                            <p style="margin: 0 0 10px 0; color: #71717A; font-size: 12px; line-height: 1.6;">
                                If you did not request this verification code, someone may be attempting to access your account. You can safely disregard this email.
                            </p>
                            <p style="margin: 0; color: #52525B; font-size: 11px;">
                                © 2026 VIZO App Inc. All rights reserved. • Secure Transactional Service
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
    `;
};

module.exports = buildOtpEmailHtml;