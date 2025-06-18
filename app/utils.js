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

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript#1349426
const randomCode = (length = 6) => {
  return Math.random().toString(36).substr(2, length);
};

const makeSlug = (str) => {
  const id = randomCode(5).toLowerCase();
  const urlName = str.replace(/\W+/g, " ").toLowerCase().replace(/ /g, "-");
  return `${urlName}-${id}`;
};

module.exports = {
  sha256,
  sendEmail,
  randomCode,
  makeSlug,
};
