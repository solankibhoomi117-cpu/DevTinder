
const mongoose = require("mongoose");

const connectedb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables");
  }

  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectedb;
