const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const userModel = require("../models/users.model");
const sendToken = require("../utils/sendToken");
const sendVerificationCode = require("../utils/sendVerificationCode");

// ! <<<<<<<<<<<<<<<---------------- Register-Controller ----------------->>>>>>>>>>>>>>>>>>>>
const registerController = catchAsyncError(async (req, res, next) => {
  // console.log(req.body);

  const { username, email, password, phone, VerificationMethod } = req.body;

  if (!username || !email || !password || !phone) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const existing_User = await userModel.findOne({
    $or: [{ email }, { phone }],
    accountVerified: false,
  });

  if (existing_User) {
    return next(new ErrorHandler("User already exist", 409));
  }

  const attempts = await userModel.countDocuments({
    $or: [{ email }, { phone }],
    accountVerified: false,
  });

  if (attempts > 3) {
    return next(
      new ErrorHandler("Too many attempts,Please try again after 30 minutes"),
    );
  }

  const newUser = await userModel.create({
    username,
    email,
    password,
    phone,
  });

  const OTP = await newUser.generateVerificationCode();

  await newUser.save();

  // console.log(VerificationMethod);

  await sendVerificationCode(OTP, VerificationMethod, email, phone);

  res.status(201).json({
    success: true,
    message:
      VerificationMethod === "email"
        ? `Verification code sent to ${email}`
        : "Verification code sent to your phone",
  });
});

// ! <<<<<<<<<<<<<<<---------------- Verify-OTP ------------------->>>>>>>>>>>>>>>>>>>>>>

const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, phone, otp } = req.body;

  if (!email || !phone || !otp) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  console.log("Step-1 Clear");
  const userEntries = await userModel.find({
    $or: [{ email }, { phone }],
    accountVerified: false,
  });

  if (!userEntries || userEntries.length === 0) {
    return next(new ErrorHandler("User not Found", 400));
  }

  let user = userEntries[0];

  if (userEntries.length > 0) {
    await userModel.deleteMany({
      _id: { $ne: user._id },
      $or: [
        { phone, accountVerified: false },
        { email, accountVerified: false },
      ],
    });
  }

  if (String(otp) != String(user.verificationCode)) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  if (Date.now() > new Date(user.verificationCodeExpire).getTime()) {
    return next(new ErrorHandler("OTP has been expired", 400));
  }

  user.verificationCode = null;
  user.accountVerified = true;
  user.verificationCodeExpire = null;

  await user.save();

  sendToken(user, 200, "Account Verified", res);
});

// ! <<<<<<<<<<<--------------- Login-Controller ----------------->>>>>>>>>>>>>>>>>>>>
const loginController = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  const isUserExist = await userModel
    .findOne({
      email,
      accountVerified: true,
    })
    .select("+password");

  if (!isUserExist) {
    return next(new ErrorHandler("User not Found!", 400));
  }

  sendToken(isUserExist, 200, "User LoggedIn Successfully", res);
});

// ! <<<<<<<<<<<<<<<------------- Logout-Controller --------------->>>>>>>>>>>>>>>>>>>
const logoutController = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged out",
    });
});

// ! <<<<<<<<<<<<<<<<------------- Get-User-Controller ----------->>>>>>>>>>>>>>>>>>>>>
const getUserController = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "User profile fetched Successfully!",
    user,
  });
});

module.exports = {
  registerController,
  verifyOTP,
  loginController,
  logoutController,
  getUserController
};
