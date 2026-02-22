const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup (frontend connect karne ke liye)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);



module.exports = app;