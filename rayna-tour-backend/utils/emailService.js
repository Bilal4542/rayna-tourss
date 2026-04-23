const nodemailer = require("nodemailer");

// Create a reusable transporter object
let transporter;

const initializeTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Use real Gmail credentials
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback to test account if no credentials are provided
    console.log("No SMTP credentials found. Generating Ethereal test account...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

const sendMagicLinkEmail = async (email, token) => {
  if (!transporter) {
    await initializeTransporter();
  }

  // The URL the user will click in the email
  const magicLink = `http://localhost:5173/verify-login?token=${token}`;

  const mailOptions = {
    from: '"Rayna Tours" <noreply@raynatours.com>',
    to: email,
    subject: "Sign in to Rayna Tours",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
        <h2 style="color: #333;">Sign in to Rayna Tours</h2>
        <p style="color: #666; font-size: 16px;">Click the button below to securely sign in to your account.</p>
        <div style="margin: 30px 0;">
          <a href="${magicLink}" style="background-color: #2D2D2D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Sign in Rayna Tours
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Or copy and paste this link into your browser:<br>${magicLink}</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Magic link email successfully sent to: %s", info.accepted);
  if (info.messageId.includes("ethereal")) {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

module.exports = {
  sendMagicLinkEmail,
};
