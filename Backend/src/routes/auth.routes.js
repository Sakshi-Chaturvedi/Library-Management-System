const express = require("express");
const {
  registerController,
  verifyOTP,
  loginController,
  logoutController,
  getUserController,
  forgotPassController,
  resetPasswordController,
} = require("../controllers/auth.controller");
const isAuthenticatedUser = require("../middlewares/auth");

const authRouter = express.Router();

// ! ------------- Register API -------------------
authRouter.post("/register", registerController);

// ! -------------- Verify OTP --------------------
authRouter.post("/verifyUser", verifyOTP);

// ! --------------- Login API --------------------
authRouter.post("/login", loginController);

// ! --------------- Logout API ------------------
authRouter.get("/logout", isAuthenticatedUser, logoutController);

// ! --------------- GetUserProfile API -------------
authRouter.get("/profile", isAuthenticatedUser, getUserController);

// ! -------------- Forgot-Password API -------------
authRouter.post("/password/forgot", forgotPassController);

// ! -------------- Reset-Password API --------------
authRouter.put("/password/reset/:token", resetPasswordController);

module.exports = authRouter;
