const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { errorMiddleware } = require("./middlewares/errorMiddleware");
const authRouter = require("./routes/auth.routes");
const bookRouter = require("./routes/book.routes");
const borrowRoute = require("./routes/borrow.routes");

const app = express();

// --------------------
// 🔹 Middlewares
// --------------------

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// CORS (Frontend connection)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// --------------------
// 🔹 Routes
// --------------------

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

// Auth Routes
app.use("/api/v1/auth", authRouter);

// Book Routes
app.use("/api/v1/book", bookRouter);

// Borrow Routes
app.use("/api/v1/book", borrowRoute);

// --------------------
// 🔹 404 Handler
// --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found ❌",
  });
});

// --------------------
// 🔹 Error Middleware (ALWAYS LAST)
// --------------------
app.use(errorMiddleware);

module.exports = app;
