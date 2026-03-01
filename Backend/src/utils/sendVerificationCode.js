const emailTemplate = require("./generateEmailTemplate");

const sendVerificationCode = async (
  verificationCode,
  verificationMethod,
  email,
  phone,
) => {
  if (!verificationMethod) {
    throw new Error("Verification Method is required.");
  }

  if (verificationMethod === "email") {
    if (!email) {
      throw new Error("Email is required.");
    }

    const message = emailTemplate(verificationCode);

    sendEmail({ email, subject: "Your Verification Code is", message });

    return {
      success: True,
      message: `verification code has been sent successfully on ${email}`,
    };
  }
};
