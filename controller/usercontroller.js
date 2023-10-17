const Task = require("../models/TaskModel");

exports.getme = async (req, res) => {
  let tasks = [];
  tasks = await Task.find({ user: req.user._id });
  res.status(200).json({ user: req.user, tasks: tasks });
};
