const express = require("express");
const {
  registerController,
  verifyOTP,
} = require("../controllers/auth.controller");

const authRouter = express.Router();

// ! ------------- Register API -------------------
authRouter.post("/register", registerController);

// ! -------------- Verify OTP --------------------
authRouter.post("/verifyUser", verifyOTP);

module.exports = authRouter;
