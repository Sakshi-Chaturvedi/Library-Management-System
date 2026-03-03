const userModel = require("../models/users.model");
const catchAsyncError = require("./catchAsyncError");
const { ErrorHandler } = require("./errorMiddleware");
const jwt = require("jsonwebtoken");

const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not Authenticated", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await userModel.findById(decoded.id);

  next();
});

module.exports = isAuthenticatedUser;
