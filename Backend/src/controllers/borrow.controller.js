const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const bookModel = require("../models/book.model");
const borrowModel = require("../models/borrow.model");
const { calculateFine } = require("../utils/fineCalculator");

const recordBorrowBook = catchAsyncError(async (req, res, next) => {
  const { bookID } = req.body;

  if (!bookID) {
    return next(new ErrorHandler("Please tell something about Book.", 400));
  }

  const Book = await bookModel.findById(bookID);

  if (!Book || Book.availableCopies === 0) {
    return next(new ErrorHandler("Book not Available", 400));
  }

  Book.availableCopies -= 1;

  const borrow = await borrowModel.create({
    user: req.user._id,
    book: bookID,
  });

  res.status(200).json({
    success: true,
    message: "Book Borrowed Successfully.",
    borrow,
  });
});



const returnBorrowBook = catchAsyncError(async (req, res, next) => {
  const borrow = await borrowModel.findById(req.params.id);

  if (!borrow || borrow.returned) {
    return next(new ErrorHandler("Invalid Borrow Record", 400));
  }

  const returnDate = new Date();
  const fine = calculateFine(borrow.borrowDate, returnDate);

  borrow.returnDate = returnDate;
  borrow.fine = fine;
  borrow.returned = true;

  await borrow.save();

  // ✅ Correct Model
  const book = await bookModel.findById(borrow.book);

  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  res.status(200).json({
    success: true,
    message: "Book Returned Successfully",
    fine,
  });
});

const borrowedBooks = catchAsyncError(async (req, res, next) => {
  const borrows = await borrowModel.find({ user: req.user._id }).populate("book");

  res.status(200).json({
    success: true,
    borrows,
  });
});

module.exports = { recordBorrowBook, returnBorrowBook, borrowedBooks };
