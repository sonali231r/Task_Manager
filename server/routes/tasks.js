const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");

// Helper to format task schema for the frontend
const formatTask = (task) => ({
  id: task._id,
  user_id: task.userId,
  title: task.title,
  description: task.description || "",
  stage: task.stage,
  created_at: task.createdAt,
  updated_at: task.updatedAt,
});

// GET /api/tasks (all routes use authMiddleware)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(tasks.map(formatTask));
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/tasks
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, stage } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      title,
      description: description || "",
      stage: stage || "todo",
      userId: req.user.id,
    });

    const savedTask = await newTask.save();
    return res.status(201).json(formatTask(savedTask));
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/tasks/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, stage } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (stage !== undefined) task.stage = stage;
    task.updatedAt = Date.now();

    const updatedTask = await task.save();
    return res.json(formatTask(updatedTask));
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
