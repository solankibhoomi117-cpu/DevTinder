const express = require("express");
const profileroute = express.Router();
const User = require("../models/User");
const { validatesignupdata } = require("../utils/validate");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");
const { validateeditprofiledata } = require("../utils/validate");

profileroute.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileroute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateeditprofiledata(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileroute.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
      throw new Error("Both passwords are required");
    }
    const loggedInUser = req.user;
    const isMatch = await bcrypt.compare(oldpassword, loggedInUser.password);
    if (!isMatch) {
      throw new Error("old password is incorrect");
    }
    loggedInUser.password = await bcrypt.hash(newpassword, 10);
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName},your password updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = profileroute;
