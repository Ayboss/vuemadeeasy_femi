const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, "Please Provide an Description for this task"],
  },
  createdAt: { type: Date },
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Tasks must belong to a user"],
  },
});

module.exports = mongoose.model("Task", TaskSchema);
