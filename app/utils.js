const crypto = require("crypto");
const nodemailer = require("nodemailer");
const config = require("./config");

const mailTransporter = nodemailer.createTransport({
  host: config.smtp_server,
  port: 587,
  // secure: false, // upgrade later with STARTTLS
  auth: {
    user: config.smtp_user,
    pass: config.smtp_password,
  },
});

const sha256 = (text) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};

const sendEmail = async ({ subject, text, to }) => {
  try {
    await mailTransporter.sendMail({
      subject,
      from: config.smtp_from,
      to,
      text,
    });
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  sha256,
  sendEmail,
};
