const express = require("express");
const {
  getAllUsersController,
  registerAdmin,
  getAdminAnalytics,
} = require("../controllers/users.controller");
const { isAuthenticatedUser, isAuthorized } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.get(
  "/allUsers",
  isAuthenticatedUser,
  isAuthorized("admin"),
  getAllUsersController,
);

userRouter.post(
  "/registerAdmin",
  isAuthenticatedUser,
  isAuthorized("admin"),
  registerAdmin,
);

userRouter.get(
  "/adminAnalytics",
  isAuthenticatedUser,
  isAuthorized("admin"),
  getAdminAnalytics,
);

module.exports = userRouter;
