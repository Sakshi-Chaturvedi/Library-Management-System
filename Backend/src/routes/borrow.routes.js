const express = require("express");
const {
  recordBorrowBook,
  returnBorrowBook,
  borrowedBooks,
  getBorrowHistoryController,
  payFineController,
} = require("../controllers/borrow.controller");
const { isAuthenticatedUser } = require("../middlewares/auth");

const borrowRoute = express.Router();

// ! <<<<<<<<<<<--------------- Borrow-Books API ------------------>>>>>>>>>>>>>
borrowRoute.post("/borrowBooks", isAuthenticatedUser, recordBorrowBook);

// ! <<<<<<<<<<<--------------- Return-Borrowed-Books API -------------->>>>>>>>>>>>>>>>>>
borrowRoute.put("/returnbook/:id", isAuthenticatedUser, returnBorrowBook);

// ! <<<<<<<<<<<--------------- Get-Borrowed-Books API ----------------->>>>>>>>>>>>>>>>>>
borrowRoute.get("/borrowedBooks", isAuthenticatedUser, borrowedBooks);

// ! <<<<<<<<<<<--------------- Get Borrow History API ------------------>>>>>>>>>>>>>>>>>>
borrowRoute.get("/history", isAuthenticatedUser, getBorrowHistoryController);

// ! <<<<<<<<<<------------ Pay-Fine-API ------------->>>>>>>>>>>>>>>>>>>>>
borrowRoute.put("/borrow/pay-fine/:id", isAuthenticatedUser, payFineController);

module.exports = borrowRoute;
