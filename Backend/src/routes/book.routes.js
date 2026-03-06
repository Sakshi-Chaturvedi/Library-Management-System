const express = require("express");
const { isAuthorized, isAuthenticatedUser } = require("../middlewares/auth");
const {
  addBookController,
  getAllBooksController,
  deleteBookController,
  getOverdueBooks,
} = require("../controllers/book.controller");
const upload = require("../middlewares/multer");

const bookRouter = express.Router();

// ! ------------ Add-Book API ----------------
bookRouter.post(
  "/addbook",
  isAuthenticatedUser,
  isAuthorized("admin"),
  upload.single("image"),
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

// ! ----------------- OverDue-Books API ----------------
bookRouter.get(
  "/overdueBooks",
  isAuthenticatedUser,
  isAuthorized("admin"),
  getOverdueBooks,
);


module.exports = bookRouter;
