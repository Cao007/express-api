const nodemailer = require('nodemailer');

/**
 * 发件箱配置
 */
const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_SECURE,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
  },
});

/**
 * 发送邮件
 * @param email
 * @param subject
 * @param html
 * @returns {Promise<void>}
 */
const sendMail = async (email, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.MAILER_USER,
      to: email,
      subject,
      html,
    });
  } catch (e) {
    console.log('邮件发送失败', e);
  }
}

module.exports = sendMail;

