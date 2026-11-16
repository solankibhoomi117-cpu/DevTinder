const { applyTimestamps } = require("./User");

const mongoose = require("mongoose");

const connectionrequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //reference to user collection
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Accepted", "Rejected", "Ignored", "Interested"],
        message: `{VALUE} is not supported as status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionrequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionrequestSchema.pre("save", function (next) {
  const ConnectionRequest = this;
  if (ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)) {
    throw new Error("cannot send connection request to yourself !!");
    next();
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionrequestSchema,
);

module.exports = ConnectionRequest;
