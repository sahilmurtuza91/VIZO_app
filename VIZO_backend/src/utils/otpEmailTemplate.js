const buildOtpEmailHtml = (otpCode, purposeLabel = "verify your account", userName = "") => {
    const formattedOtp = otpCode.toString().split("").join(" ");
    const recipientName = userName ? `Hi ${userName},` : "Hi there,";

    // Dynamic Title based on purpose
    let headingTitle = "Verification Code";
    if (purposeLabel.includes("reset")) {
        headingTitle = "Password Reset Request";
    } else if (purposeLabel.includes("login")) {
        headingTitle = "Security Verification";
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headingTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" maxWidth="440" cellpadding="0" cellspacing="0" style="max-width: 440px; background-color: #141416; border-radius: 20px; border: 1px solid #2C2C2E; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header Bar with VIZO Brand Gradient -->
          <tr>
            <td style="background: linear-gradient(90deg, #FF1616 0%, #FF7A00 100%); padding: 22px 28px; text-align: left;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">VIZO</span>
                  </td>
                  <td style="text-align: right;">
                    <span style="color: rgba(255,255,255,0.85); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Real Estate Agent</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 28px 12px 28px;">
              <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">${headingTitle}</h1>
              <p style="color: #E5E5EA; font-size: 15px; font-weight: 500; margin: 0 0 10px 0;">${recipientName}</p>
              <p style="color: #A0A0A5; font-size: 14px; line-height: 22px; margin: 0;">
                Use the verification code below to ${purposeLabel}. This code is valid for 
                <strong style="color: #FF7A00; font-weight: 700;">5 minutes</strong> and should not be shared with anyone.
              </p>
            </td>
          </tr>

          <!-- OTP Code Highlight Box -->
          <tr>
            <td align="center" style="padding: 24px 28px;">
              <div style="background-color: #1C1C1E; border: 1.5px solid #2C2C2E; border-radius: 14px; padding: 18px 24px; text-align: center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);">
                <span style="color: #FF7A00; font-size: 34px; font-weight: 800; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace; display: inline-block; margin-left: 12px;">${formattedOtp}</span>
              </div>
            </td>
          </tr>

          <!-- Security Note -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <p style="color: #7C7C80; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                If you didn't request this code, someone may be trying to access your VIZO account. You can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer Divider & Copyright -->
          <tr>
            <td style="padding: 18px 28px; background-color: #0F0F11; border-top: 1px solid #242426; text-align: center;">
              <p style="color: #55555A; font-size: 11px; font-weight: 500; margin: 0;">
                © 2026 VIZO App Inc. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = buildOtpEmailHtml;