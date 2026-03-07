const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const bookModel = require("../models/book.model");
const borrowModel = require("../models/borrow.model");
// const { ErrorHandler } = require("..middlewares/errorMiddleware");
const userModel = require("../models/users.model");
const sendVerificationCode = require("../utils/sendVerificationCode");

// ! <<<<<<<<<<<<<---------------- Get-All-Users-Controller (Admin) ------------->>>>>>>>>>>>>
const getAllUsersController = catchAsyncError(async (req, res, next) => {
  const { keyword, role, page = 1, limit = 5 } = req.query;

  const query = {};

  // ? Search by username or email
  if (keyword) {
    query.$or = [
      { username: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ];
  }

  // ? Filter by role
  if (role) {
    query.role = role;
  }

  const skip = (page - 1) * limit;

  const users = await userModel
    .find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const usersWithBorrowCount = await Promise.all(
    users.map(async (user) => {
      const totalBorrowedBooks = await borrowModel.countDocuments({ user: user._id });
      return {
        ...user.toObject(),
        totalBorrowedBooks,
      };
    })
  );

  const totalUsers = await userModel.countDocuments(query);

  if (!users || users.length === 0) {
    return next(new ErrorHandler("No users found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: Number(page),
    users: usersWithBorrowCount,
  });
});

// ! <<<<<<<<<<<<<---------------- Register-New-Admin-Controller (Admin) ----------------->>>>>>>>>>>>>
const registerAdmin = catchAsyncError(async (req, res, next) => {
  const { username, email, password, phone, verificationMethod } = req.body;

  // ? Check required fields
  if (!username || !email || !password || !phone || !verificationMethod) {
    return next(new ErrorHandler("All Fields are Required.", 400));
  }

  // ? Check existing user
  const isUser = await userModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (isUser) {
    return next(new ErrorHandler("User already exists.", 400));
  }

  // ? Create admin
  const newAdmin = await userModel.create({
    username,
    email,
    password,
    phone,
    role: "admin",
  });

  // ? Generate OTP
  const OTP = newAdmin.generateVerificationCode();

  await newAdmin.save({ validateBeforeSave: false });

  // ? Send OTP
  try {
    await sendVerificationCode(OTP, verificationMethod, email, phone);
  } catch (error) {
    return next(new ErrorHandler("OTP could not be sent.", 500));
  }

  res.status(201).json({
    success: true,
    message: `OTP sent successfully on ${
      verificationMethod === "email" ? email : phone
    }`,
  });
});

// ! <<<<<<<<<<<<---------------- Admin-Dashboard-Stats-Controller ------------->>>>>>>>>>>>>>>>>>
const getAdminAnalytics = catchAsyncError(async (req, res, next) => {
  const totalBooks = await bookModel.countDocuments();

  const totalUsers = await userModel.countDocuments({
    role: "user",
  });

  const totalBorrows = await borrowModel.countDocuments();

  const totalFines = await borrowModel.aggregate([
    {
      $group: {
        _id: null,
        totalFine: { $sum: "$fine" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalBooks,
      totalUsers,
      totalBorrows,
      totalFineCollected: totalFines[0]?.totalFine || 0,
    },
  });
});

module.exports = { getAllUsersController, registerAdmin, getAdminAnalytics };
