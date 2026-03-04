const express = require("express");
const {
  recordBorrowBook,
  returnBorrowBook,
  borrowedBooks,
} = require("../controllers/borrow.controller");
const { isAuthenticatedUser } = require("../middlewares/auth");

const borrowRoute = express.Router();

// ! <<<<<<<<<<<--------------- Borrow-Books API ------------------>>>>>>>>>>>>>
borrowRoute.post("/borrowBooks", isAuthenticatedUser, recordBorrowBook);

// ! <<<<<<<<<<<--------------- Return-Borrowed-Books API -------------->>>>>>>>>>>>>>>>>>
borrowRoute.put("/returnbook/:id", isAuthenticatedUser, returnBorrowBook);

// ! <<<<<<<<<<<--------------- Get-Borrowed-Books API ----------------->>>>>>>>>>>>>>>>>>
borrowRoute.get("/borrowedBooks", isAuthenticatedUser, borrowedBooks);

module.exports = borrowRoute;
