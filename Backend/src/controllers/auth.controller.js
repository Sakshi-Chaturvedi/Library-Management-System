const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const userModel = require("../models/users.model");

const registerController = catchAsyncError(async (req, res, next) => {
  const { username, email, password, phone } = req.body;

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

  if (count > 3) {
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

    await newUser.save()

    
});
