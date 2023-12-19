const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(401).json("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordValid) {
    return res.status(401).json("Invalid credentials");
  }

  const token = jwt.sign(user._id.toJSON(), process.env.JWT_SECRET);

  const { password, ...rest } = user.toObject();

  res
    .cookie("access_token", token, {
      httpOnly: true,
      path: "/",
      secure: true,
    })
    .status(200)
    .json(rest);
};

const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json("Logged out");
};

const register = async (req, res) => {
  const { username, email, password, img } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (existingUser) {
    return res.status(409).json("User already exists");
  }

  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hashSync(password, salt);

  // CHECK IF USER HAS PASSED IMAGE
  const userObject = { username, email, password: hashedPassword };

  if (img) {
    userObject.img = img;
  }

  const user = new User(userObject);

  await user.save();
  res.status(201).json("User has been created.");
};

module.exports = { login, logout, register };
