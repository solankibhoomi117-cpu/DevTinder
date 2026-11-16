const express = require("express");
const userroute = express.Router();
const User = require("../models/User");
const { validatesignupdata } = require("../utils/validate");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionrequests");

// Get all the pending connection request for the loggedIn user

userroute.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "age",
      "photourl",
      "gender",
    ];
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "Interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userroute.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "age",
      "photourl",
      "gender",
    ];
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "Accepted" },
        { fromUserId: loggedInUser._id, status: "Accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userroute.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const USER_SAFE_DATA = [
      "firstName",
      "lastName",
      "age",
      "photourl",
      "gender",
    ];
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideuserfromfeed = new Set();
    connectionRequest.forEach((req) => {
      hideuserfromfeed.add(req.fromUserId._id.toString());
      hideuserfromfeed.add(req.toUserId._id.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideuserfromfeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userroute;
