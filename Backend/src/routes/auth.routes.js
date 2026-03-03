const express = require("express");
const {
  registerController,
  verifyOTP,
  loginController,
  logoutController,
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

module.exports = authRouter;
