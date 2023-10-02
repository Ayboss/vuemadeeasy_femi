const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide a password"],
    lowercase: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
