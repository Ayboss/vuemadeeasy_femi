const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/TaskModel");
const { promisify } = require("util");

const createJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const encryptPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

exports.login = async (req, res) => {
  try {
    // check if username and password are there
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: "Username and Password are required",
      });
    }

    // find the user
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).json({
        message: "incorrect Username or Password",
      });
    }
    // compare the password
    if (!(await comparePassword(req.body.password, user.password))) {
      return res.status(400).json({
        message: "incorrect Username or Password",
      });
    }

    user.password = undefined;
    const token = createJWTToken(user._id);
    let tasks = await Task.find({ user: user._id });
    if (!tasks) {
      tasks = [];
    }
    return res.status(200).json({
      status: "success",
      token,
      data: { user, tasks },
    });
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      error: err,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    // check if username and password are there
    if (
      !req.body.email ||
      !req.body.username ||
      !req.body.password ||
      !req.body.passwordConfirm
    ) {
      return res.status(400).json({
        message: "Email, Username, Password are required",
      });
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        message: "Password and Confirm password should match",
      });
    }
    // encrypt password
    const encrypt = await encryptPassword(req.body.password);

    // add information to database
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: encrypt,
    });

    user.password = undefined;
    const token = createJWTToken(user._id);

    return res.status(200).json({
      status: "success",
      token,
      data: user,
    });
    // send token to user
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      error: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "error",
        msg: "Please login to access this route",
      });
    }
    //verify token;
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if user still exits
    const currentUser = await User.findById(decode.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        msg: "User with token does not exit",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      msg: "Something went wrong",
    });
  }
};
