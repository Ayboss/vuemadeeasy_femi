const Task = require("../models/TaskModel");

exports.createTask = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({
        status: "error",
        data: "Title and Description are required",
      });
    }
    req.body.createdAt = new Date();
    const task = await Task.create({ ...req.body, user: req.user._id });
    return res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "error",
      data: "Unable to Create Task",
    });
  }
};
exports.getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    return res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      err: "an error occured, unable to get tasks",
    });
  }
};
exports.getTask = async (req, res) => {
  try {
    const id = req.params.id;

    // make sure it is that user own
    const task = await Task.find({ _id: id, user: req.user._id });
    return res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      err: "an error occured, unable to get task",
    });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        status: "error",
        data: "Task was not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      err: "an error occured, unable to update task",
    });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!doc) {
      return res.status(404).json({
        status: "error",
        data: "Task was not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: doc,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      err: "an error occured, unable to delete task",
    });
  }
};
