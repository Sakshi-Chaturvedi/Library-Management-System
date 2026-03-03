const userModel = require("../models/users.model");
const catchAsyncError = require("./catchAsyncError");
const { ErrorHandler } = require("./errorMiddleware");
const jwt = require("jsonwebtoken");

// ✅ Authentication Middleware
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ErrorHandler("User is not Authenticated", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await userModel.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User no longer exists", 401));
  }

  req.user = user;
  next();
});

// ✅ Authorization Middleware
exports.isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler("Access Denied: Unauthorized Role", 403)
      );
    }
    next();
  };
};