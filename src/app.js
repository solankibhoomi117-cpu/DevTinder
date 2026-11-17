require("dotenv").config();

const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require("./models/User");
const { validatesignupdata } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const routes = express.Router();
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieparser());

const authrouter = require("./routes/authorization");
const profileroute = require("./routes/profile");
const requestroute = require("./routes/requestroute");
const userroute = require("./routes/userroute");

app.use("/", authrouter);
app.use("/", profileroute);
app.use("/", requestroute);
app.use("/", userroute);

const dbReady = connectdb();

dbReady.catch((err) => {
  console.error("Database connection failed:", err);
});

app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "DevTinder API is running!" });
});

module.exports = app;

if (require.main === module) {
  app.listen(process.env.PORT || 8080, () => {
    console.log("Server is running");
  });
}
