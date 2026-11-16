const express = require("express");
const authrouter = express.Router();
const User = require("../models/User");
const { validatesignupdata } = require("../utils/validate");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

authrouter.post("/Signup", async (req, res) => {
  // creating new instance of user model
  try {
    validatesignupdata(req);

    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      photourl,
      about,
      skills,
    } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordhash,
      age,
      gender,
      photourl,
      about,
      skills,
    });
    await user.save();
    res.send("User signed up successfully");
  } catch (error) {
    res.status(500).send("ERROR : " + error.message);
  }
});

authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const ispasswordvalid = await user.validatepassword(password);
    if (ispasswordvalid) {
      // create token

      const token = await user.getJWT();

      // Add the token to cookie and send the response back
     res.cookie("token", token, {
  expires: new Date(Date.now() + 8 * 3600000),
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authrouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now() + 8 * 3600000),
  });
  res.send("Logout successfully");
});
module.exports = authrouter;
