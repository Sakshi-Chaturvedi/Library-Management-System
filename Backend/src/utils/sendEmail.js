const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // easy setup
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Library Management <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully ✅");
  } catch (error) {
    console.error("Email sending failed ❌", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;