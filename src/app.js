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
    origin: "http://localhost:5173",
    credentials: true,
  }),
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

connectdb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(8080, () => {
      console.log("Server is listening on port 8080 ....");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
