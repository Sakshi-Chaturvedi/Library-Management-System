const express = require("express");
const { isAuthorized, isAuthenticatedUser } = require("../middlewares/auth");
const {
  addBookController,
  getAllBooksController,
  getBookByIdController,
  getTrendingBooksController,
  getRecentlyAddedBooksController,
  deleteBookController,
  updateBookController,
  getOverdueBooks,
  getRecommendedBooksController,
} = require("../controllers/book.controller");
const upload = require("../middlewares/multer");

const bookRouter = express.Router();

// ! ------------ Add-Book API ----------------
bookRouter.post(
  "/addbook",
  isAuthenticatedUser,
  isAuthorized("admin"),
  upload.single("coverImage"),
  addBookController,
);

// ! ------------- Get All Books API ---------------
bookRouter.get("/getbooks", isAuthenticatedUser, getAllBooksController);

// ! ------------- Get Recently Added Books API --------
bookRouter.get("/recent", isAuthenticatedUser, getRecentlyAddedBooksController);

// ! ------------- Get Trending Books API ---------------
bookRouter.get("/trending", isAuthenticatedUser, getTrendingBooksController);

// ! ------------- Get Book by ID API ---------------
bookRouter.get("/getbook/:id", isAuthenticatedUser, getBookByIdController);

// ! ------------- Delete Book API ----------------
bookRouter.delete(
  "/deletebook/:id",
  isAuthenticatedUser,
  isAuthorized("admin"),
  deleteBookController,
);

// ! ------------- Update Book API ----------------
bookRouter.put(
  "/updatebook/:id",
  isAuthenticatedUser,
  isAuthorized("admin"),
  upload.single("coverImage"),
  updateBookController,
);

// ! ----------------- OverDue-Books API ----------------
bookRouter.get(
  "/overdueBooks",
  isAuthenticatedUser,
  isAuthorized("admin"),
  getOverdueBooks,
);


// ! ----------------- Get Recommended Books API ----------------
bookRouter.get(
  "/recommendations",
  isAuthenticatedUser,
  getRecommendedBooksController,
);

module.exports = bookRouter;
