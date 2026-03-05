const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
// const { ErrorHandler } = require("..middlewares/errorMiddleware");
const userModel = require("../models/users.model");
const sendVerificationCode = require("../utils/sendVerificationCode");

// ! <<<<<<<<<<<<<---------------- Get-All-Users-Controller (Admin) ------------->>>>>>>>>>>>>
const getAllUsersController = catchAsyncError(async (req, res, next) => {
  const allUsers = await userModel.find();

  if (!allUsers || allUsers.length === 0) {
    return next(new ErrorHandler("No user Found in the DB!", 400));
  }

  res.status(200).json({
    success: true,
    message: "All users Fetched Successfully",
    allUsers,
  });
});

// ! <<<<<<<<<<<<<---------------- Register-New-Admin-Controller (Admin) ----------------->>>>>>>>>>>>>
const registerAdmin = catchAsyncError(async (req, res, next) => {
  const { username, email, password, phone, verificationMethod } = req.body;

  if (!username || !email || !password || !phone || !verificationMethod) {
    return next(new ErrorHandler("All Fields are Required.", 400));
  }

  const isUser = await userModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (isUser) {
    return next(new ErrorHandler("User already exists.", 400));
  }

  const newAdmin = await userModel.create({
    username,
    email,
    password,
    phone,
    role: "admin",
  });

  const OTP = newAdmin.generateVerificationCode();

  await newAdmin.save();

  await sendVerificationCode(OTP, verificationMethod, email, phone);

  res.status(201).json({
    success: true,
    message: `OTP sent successfully on ${verificationMethod === "email" ? email : phone}`,
  });
});

module.exports = { getAllUsersController, registerAdmin };
