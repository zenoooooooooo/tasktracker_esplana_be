const { Task } = require("../models/Task");
const { User } = require("../models/User");

exports.create = async (req, res) => {
  try {
    let { title, description } = req.body;
    const { email } = req;
    const user = await User.findOne({ email });

    if (!title) {
      return res.status(400).send({ message: "Please enter a title" });
    } else if (!description) {
      description = "No description";
    } else if (!user) {
      return res.status(400).send({ message: "Login first" });
    }

    const newTask = {
      title: title,
      description: description,
      user: user,
    };

    const task = await Task.create(newTask);

    return res.status(201).send(task);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.showAll = async (req, res) => {
  try {
    const { email } = req;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Task not found" });
    }

    const tasks = await Task.find({ user: user._id });
    res.status(200).send(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { _id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).send({
        message: "Send all required fields: title, description, _id",
      });
    }

    const result = await Task.findByIdAndUpdate(_id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { _id } = req.params;
    const task = await Task.findByIdAndDelete(_id);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    return res.status(200).send({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { _id } = req.params;
    const task = await Task.findByIdAndUpdate(_id, req.body);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    return res.status(200).send({ message: "Task completed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};
