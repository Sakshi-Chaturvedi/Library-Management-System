const catchAsyncError = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const bookModel = require("../models/book.model");
const borrowModel = require("../models/borrow.model");
const cloudinary = require("cloudinary").v2;

// ! <<<<<<<<<<<<-------------- Add-Books-Controller --------------->>>>>>>>>>>
const addBookController = catchAsyncError(async (req, res, next) => {
  console.log(req.file);

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

  const existingBook = await bookModel.findOne({ isbn });

  if (existingBook) {
    return next(new ErrorHandler("Book with this ISBN already exists!", 400));
  }

  if (!req.file) {
    return next(new ErrorHandler("Book cover image is required!", 400));
  }

  // 4️⃣ Upload Image to Cloudinary
  const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
    folder: "library_books",
  });

  console.log(uploadedImage.secure_url);

  const book = await bookModel.create({
    title,
    author,
    isbn,
    category,
    totalCopies,
    availableCopies,
    coverImage: {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Book Added Successfully",
    book,
  });
});

// ! <<<<<<<<<<<<-------------- Get Recently Added Books --------------->>>>>>>>>>>>>>>
const getRecentlyAddedBooksController = catchAsyncError(async (req, res, next) => {
  const books = await bookModel
    .find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    recentBooks: books,
  });
});

// ! <<<<<<<<<<<<-------------- Get Trending Books --------------->>>>>>>>>>>>>>>
const getTrendingBooksController = catchAsyncError(async (req, res, next) => {
  const books = await bookModel
    .find()
    .sort({ borrowCount: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    trendingBooks: books,
  });
});

// ! <<<<<<<<<<<<-------------- Get All Books --------------->>>>>>>>>>>>>>>>>>>
const getAllBooksController = catchAsyncError(async (req, res, next) => {
  const { keyword, category, page = 1, limit = 5 } = req.query;

  const query = {};

  // ? Search by title or author or category
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { author: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }

  // ? Filter by category
  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const books = await bookModel
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalBooks = await bookModel.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Books fetched successfully",
    totalBooks,
    totalPages: Math.ceil(totalBooks / limit),
    currentPage: Number(page),
    books,
  });
});


// ! <<<<<<<<<<<<-------------- Get Book by ID --------------->>>>>>>>>>>>>>>>>>>
const getBookByIdController = catchAsyncError(async (req, res, next) => {
  const book = await bookModel.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Book fetched successfully",
    book,
  });
});

// ! <<<<<<<<<<<<<------------- Delete-Book-Controller ------------->>>>>>>>>>>>>>
const deleteBookController = catchAsyncError(async (req, res, next) => {
  const book = await bookModel.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book Not Found", 404));
  }

  // delete image from cloudinary
  if (book.coverImage?.public_id) {
    await cloudinary.uploader.destroy(book.coverImage.public_id);
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book Deleted Successfully",
  });
});

// ! <<<<<<<<<<<<<------------ Get-OverDue-Books-API -------------->>>>>>>>>>>>>>>
const getOverdueBooks = catchAsyncError(async (req, res, next) => {
  const today = new Date();

  const overdueBooks = await borrowModel
    .find({
      returned: false,
      dueDate: { $lt: today },
    })
    .populate("user", "username email")
    .populate("book", "title author");

  res.status(200).json({
    success: true,
    overdueBooks,
  });
});

// module.exports = { deleteBookController };

// ! <<<<<<<<<<<<<------------- Update-Book-Controller ------------->>>>>>>>>>>>>>
const updateBookController = catchAsyncError(async (req, res, next) => {
  let book = await bookModel.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book Not Found", 404));
  }

  const { title, author, isbn, category, totalCopies, availableCopies } = req.body;

  let updateData = {
    title,
    author,
    isbn,
    category,
    totalCopies,
    availableCopies,
  };

  if (req.file) {
    // delete previous image from cloudinary
    if (book.coverImage?.public_id) {
      await cloudinary.uploader.destroy(book.coverImage.public_id);
    }

    // upload new image
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "library_books",
    });

    updateData.coverImage = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  book = await bookModel.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Book Updated Successfully",
    book,
  });
});

// ! <<<<<<<<<<<<<-------------- Get Recommended Books ------------->>>>>>>>>>>>>>
const getRecommendedBooksController = catchAsyncError(async (req, res, next) => {
  // 1. Get user borrows
  const userBorrows = await borrowModel.find({ user: req.user._id }).populate("book");

  // 2. Extract categories
  const categories = Array.from(new Set(
    userBorrows.map((record) => record.book?.category).filter(Boolean)
  ));

  // 3. Extract IDs of already borrowed books
  const borrowedBookIds = userBorrows.map((record) => record.book?._id).filter(Boolean);

  // 4. Query recommendation (same categories, exclude already borrowed)
  const recommendations = await bookModel.find({
    category: { $in: categories },
    _id: { $nin: borrowedBookIds }
  }).limit(5);

  res.status(200).json({
    success: true,
    recommendedBooks: recommendations
  });
});

module.exports = {
  addBookController,
  getAllBooksController,
  getBookByIdController,
  getTrendingBooksController,
  getRecentlyAddedBooksController,
  getRecommendedBooksController,
  updateBookController,
  deleteBookController,
  getOverdueBooks,
};
