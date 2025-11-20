// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text, html) => {
  try {
    // Transporter config using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Cooking Recipe App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
