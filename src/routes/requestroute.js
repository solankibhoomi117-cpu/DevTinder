const express = require("express");
const requestroute = express.Router();
const User = require("../models/User");
const { validatesignupdata } = require("../utils/validate");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionrequests");

requestroute.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["Ignored", "Interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }
      const touser = await User.findById(toUserId);
      if (!touser) {
        return res.status(404).json({ message: "User not found !!" });
      }
      // IF there is an existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + " is " + status + " in you",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

requestroute.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const allowedstatus = ["Accepted", "Rejected"];
      const { status, requestId } = req.params;

      if (!allowedstatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "Interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found !!" });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({
        message: "Connection Request " + status + "Successfully !!",
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  },
);
module.exports = requestroute;
