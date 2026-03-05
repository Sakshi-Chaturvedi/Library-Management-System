const express = require("express");
const { isAuthorized, isAuthenticatedUser } = require("../middlewares/auth");
const {
  addBookController,
  getAllBooksController,
  deleteBookController,
} = require("../controllers/book.controller");
const upload = require("../middlewares/multer");

const bookRouter = express.Router();

// ! ------------ Add-Book API ----------------
bookRouter.post(
  "/addbook",
  isAuthenticatedUser,
  isAuthorized("admin"),
  upload.single("image"),
  addBookController
);

// ! ------------- Get All Books API ---------------
bookRouter.get("/getbooks", isAuthenticatedUser, getAllBooksController);

// ! ------------- Delete Book API ----------------
bookRouter.delete(
  "/deletebook/:id",
  isAuthenticatedUser,
  isAuthorized("admin"),
  deleteBookController,
);

module.exports = bookRouter;
