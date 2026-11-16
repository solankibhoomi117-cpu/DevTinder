const validator = require("validator");

const validatesignupdata = (req) => {
  const { firstName, lastName, email, password, age } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (firstName.length < 3 || firstName.length > 10) {
    throw new Error("First name should be between 3 and 10 characters");
  } else if (lastName.length < 3 || lastName.length > 20) {
    throw new Error("First name should be between 3 and 20 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateeditprofiledata = (req) => {
  const allowededitfields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photourl",
  ];

  const iseditallowed = Object.keys(req.body).every((field) =>
    allowededitfields.includes(field),
  );

  return iseditallowed;
};

module.exports = { validatesignupdata, validateeditprofiledata };
