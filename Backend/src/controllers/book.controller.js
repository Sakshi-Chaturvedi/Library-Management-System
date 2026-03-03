const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const bookModel = require("../models/book.model");

// ! <<<<<<<<<<<<-------------- Add-Books-Controller --------------->>>>>>>>>>>
const addBookController = catchAsyncError(async (req, res, next) => {
  const { title, author, isbn, category, totalCopies, availableCopies } =
    req.body;

  if (
    !title ||
    !author ||
    !isbn ||
    !category ||
    !totalCopies ||
    !availableCopies
  ) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  const book = await bookModel.create({
    title,
    author,
    isbn,
    category,
    totalCopies,
    availableCopies,
  });

  res.status(201).json({
    success: true,
    message: "Book Added Successfully",
    book,
  });
});

// ! <<<<<<<<<<<<-------------- Get All Books --------------->>>>>>>>>>>>>>>>>>>
const getAllBooksController = catchAsyncError(async (req, res, next) => {
  const books = await bookModel.find();

  res.status(200).json({
    success: true,
    message: "All books fetched Successfully",
    books,
  });
});

// ! <<<<<<<<<<<<<------------- Delete-Book-Controller ------------->>>>>>>>>>>>>>
const deleteBookController = catchAsyncError(async (req, res, next) => {
  const book = await bookModel.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book Not Found", 404));
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book Deleted Successfully",
  });
});

module.exports = { deleteBookController };

module.exports = {
  addBookController,
  getAllBooksController,
  deleteBookController,
};
