require("dotenv").config();

// 4-digit OTP generator
const otp = () => {
  return Math.floor(Math.random() * 9000) + 1000;
};

// Base Brevo transactional email sender
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const apiKey = process.env.BREVO_API || process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_USER || process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.EMAIL_SENDER_NAME || "Dwellio";

    if (!apiKey || !senderEmail) {
      console.warn("⚠️ Brevo email not configured: missing BREVO_API or EMAIL_USER in .env");
      return null;
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Brevo Email Error:", errorData);
      throw new Error(`Failed to send email via Brevo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

// Welcome email template
const sendWelcomeEmail = async (email, name, role = "user") => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">Welcome to Dwellio, ${name}! 👋</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Your account has been created successfully. We're thrilled to have you join our verified real estate marketplace.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Account Details</h4>
        <p style="margin: 4px 0; color: #334155; font-size: 14px;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 4px 0; color: #334155; font-size: 14px;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 4px 0; color: #334155; font-size: 14px;"><strong>Role:</strong> <span style="text-transform: capitalize;">${role}</span></p>
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        Start searching for your dream apartment, villa, or commercial space across India's top cities.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        Regards,<br />
        <strong style="color: #475569;">Dwellio Team</strong>
      </p>
    </div>
  `;
  return await sendEmail(email, "Welcome to Dwellio!", html);
};

// Password Reset OTP email template
const sendOtpEmail = async (email, generatedOtp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; text-align: center;">
      <h2 style="color: #0f172a; margin-bottom: 12px;">Password Reset Request</h2>
      <p style="color: #475569; font-size: 14px; line-height: 1.5;">
        You requested to reset your password. Use the following One-Time Password (OTP) to proceed:
      </p>

      <div style="background-color: #e0e7ff; color: #4338ca; border-radius: 8px; padding: 16px; margin: 24px 0; display: inline-block;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px;">${generatedOtp}</span>
      </div>

      <p style="color: #64748b; font-size: 13px; margin: 8px 0;">
        ⏱️ This OTP is valid for <strong>5 minutes</strong>.
      </p>
      <p style="color: #e11d48; font-size: 12px; font-weight: 600; margin: 4px 0;">
        🔒 Do not share this OTP with anyone.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  `;
  return await sendEmail(email, "Password Reset OTP - Dwellio", html);
};

module.exports = {
  otp,
  sendEmail,
  sendWelcomeEmail,
  sendOtpEmail,
};
