const express = require("express");
const {
  registerController,
  verifyOTP,
  loginController,
} = require("../controllers/auth.controller");

const authRouter = express.Router();

// ! ------------- Register API -------------------
authRouter.post("/register", registerController);

// ! -------------- Verify OTP --------------------
authRouter.post("/verifyUser", verifyOTP);

// ! --------------- Login API --------------------
authRouter.post("/login", loginController);

module.exports = authRouter;
