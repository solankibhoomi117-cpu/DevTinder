
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectdb = require("./config/database");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Database connection
const dbReady = connectdb();

dbReady.catch((err) => {
  console.error("Database connection failed:", err);
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "DevTinder API is running!" });
});

// Wait for database before handling API routes
app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Routes
const authrouter = require("./routes/authorization");
const profileroute = require("./routes/profile");
const requestroute = require("./routes/requestroute");
const userroute = require("./routes/userroute");

app.use("/", authrouter);
app.use("/", profileroute);
app.use("/", requestroute);
app.use("/", userroute);

module.exports = app;

// Local development only
if (require.main === module) {
  app.listen(process.env.PORT || 8080, () => {
    console.log("Server is running");
  });
}
