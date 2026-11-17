const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photourl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid url");
        }
      },
    },
    about: {
      type: String,
      default: "Default things about me",
      minlength: 5,
      maxlength: 50,
    },
    skills: {
      type: [String],
      minlength: 1,
      maxlength: 10,
    },
  },

  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;
 if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

  return token;
};

userSchema.methods.validatepassword = async function (passwordInputbyuser) {
  const user = this;
  const passwordhash = user.password;
  const ispasswordvalid = await bcrypt.compare(
    passwordInputbyuser,
    passwordhash,
  );

  return ispasswordvalid;
};

module.exports = mongoose.model("User", userSchema);
