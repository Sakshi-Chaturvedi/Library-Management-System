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

  if (!Book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  if (Book.availableCopies <= 0) {
    return next(new ErrorHandler("Book not available", 400));
  }

  const alreadyBorrowed = await borrowModel.findOne({
    user: req.user._id,
    book: bookID,
    returned: false,
  });

  if (alreadyBorrowed) {
    return next(new ErrorHandler("You already borrowed this book", 400));
  }

  Book.availableCopies -= 1;
  Book.borrowCount = (Book.borrowCount || 0) + 1;

  await Book.save();

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

  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  if (borrow.returned) {
    return next(new ErrorHandler("Book already returned", 400));
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
  const borrows = await borrowModel
    .find({ user: req.user._id })
    .populate("book");

  res.status(200).json({
    success: true,
    borrows,
  });
});

const getBorrowHistoryController = catchAsyncError(async (req, res, next) => {
  const query = req.user.role === "admin" ? {} : { user: req.user._id };

  const history = await borrowModel
    .find(query)
    .populate("user", "username email")
    .populate("book")
    .sort({ borrowDate: -1 });

  res.status(200).json({
    success: true,
    history,
  });
});

const payFineController = catchAsyncError(async (req, res, next) => {
  const borrow = await borrowModel.findById(req.params.id);

  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  if (borrow.fine === 0) {
    return next(new ErrorHandler("No fine to pay", 400));
  }

  if (borrow.finePaid) {
    return next(new ErrorHandler("Fine already paid", 400));
  }

  borrow.finePaid = true;
  borrow.paymentDate = new Date();

  await borrow.save();

  res.status(200).json({
    success: true,
    message: "Fine paid successfully",
    borrow,
  });
});

module.exports = {
  recordBorrowBook,
  returnBorrowBook,
  borrowedBooks,
  getBorrowHistoryController,
  payFineController,
};
