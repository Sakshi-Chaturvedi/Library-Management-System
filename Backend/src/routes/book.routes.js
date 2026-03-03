const express = require("express");
const { isAuthorized, isAuthenticatedUser } = require("../middlewares/auth");
const {
  addBookController,
  getAllBooksController,
  deleteBookController,
} = require("../controllers/book.controller");

const bookRouter = express.Router();

// ! ------------ Add-Book API ----------------
bookRouter.post(
  "/addbook",
  isAuthenticatedUser,
  isAuthorized("admin"),
  addBookController,
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
