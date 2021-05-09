const config = {
  port: process.env.PORT,
  mongodb_url: process.env.MONGODB_URL,
  version: process.env.VERSION,
  smtp_server: process.env.SMTP_SERVER,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  smtp_from: process.env.SMTP_FROM,
};

module.exports = config;
