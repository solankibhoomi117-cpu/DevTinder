const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
   if (!token) {
  return res.status(401).send("please login");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

const decodedobj = await jwt.verify(token, process.env.JWT_SECRET);


    const { _id } = decodedobj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user does not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {
  userAuth,
};
