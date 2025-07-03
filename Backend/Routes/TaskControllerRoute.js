import express from "express";
import mongoose from "mongoose";
import { TaskModel } from "../Models/task.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

export const taskControllerRouter = express.Router();

// Get all tasks related to the user (as assignee or assigner)
taskControllerRouter.get("/my-tasks", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const tasks = await TaskModel.find({
      $or: [{ assignees: userId }, { assigner: userId }],
    })
      .populate("assignees", "name email")
      .populate("assigner", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks (my-tasks):", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// Get tasks assigned TO the user (user is assignee)
taskControllerRouter.get(
  "/assigned-to-me",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);

      const tasks = await TaskModel.find({
        assignees: userId,
      })
        .populate("assignees", "name email")
        .populate("assigner", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        tasks,
      });
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch assigned tasks",
        error: error.message,
      });
    }
  }
);

// Get tasks assigned BY the user (user is assigner)
taskControllerRouter.get(
  "/assigned-by-me",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);

      const tasks = await TaskModel.find({
        assigner: userId,
      })
        .populate("assignees", "name email")
        .populate("assigner", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        tasks,
      });
    } catch (error) {
      console.error("Error fetching created tasks:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch created tasks",
        error: error.message,
      });
    }
  }
);

// Get all tasks (for admin or team overview)
taskControllerRouter.get("/all", authMiddleware, async (req, res) => {
  try {
    const tasks = await TaskModel.find({})
      .populate("assignees", "name email")
      .populate("assigner", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// Parameterized routes LAST
taskControllerRouter.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.taskId)
      .populate("assignees", "name email")
      .populate("assigner", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
});

// Delete task
taskControllerRouter.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const task = await TaskModel.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Only assigner can delete task
    if (
      (typeof task.assigner === "object"
        ? String(task.assigner._id)
        : String(task.assigner)) !== String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Only task creator can delete task",
      });
    }

    await TaskModel.findByIdAndDelete(req.params.taskId);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

// Update task status/progress
taskControllerRouter.patch(
  "/:taskId/status",
  authMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;
      const userId = new mongoose.Types.ObjectId(req.user._id);

      // Find the task
      const task = await TaskModel.findById(req.params.taskId);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      // Only assigner or assignee can update status
      const isAssigner =
        (typeof task.assigner === "object" &&
        task.assigner !== null &&
        task.assigner._id
          ? String(task.assigner._id)
          : String(task.assigner)) === String(userId);

      const isAssignee = Array.isArray(task.assignees)
        ? task.assignees.some(
            (a) =>
              (typeof a === "object" && a !== null && a._id
                ? String(a._id)
                : String(a)) === String(userId)
          )
        : false;

      if (!isAssigner && !isAssignee) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this task",
        });
      }

      // Update status
      task.status = status;
      await task.save();

      // Populate before returning
      const updatedTask = await TaskModel.findById(task._id)
        .populate("assignees", "name email")
        .populate("assigner", "name email");

      res.json({
        success: true,
        task: updatedTask,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update task status",
        error: error.message,
      });
    }
  }
);

// Update task (full update, only assigner can do this)
taskControllerRouter.put("/:taskId", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { title, description, dueDate, priority, assignees, status } =
      req.body;

    // Find the task
    const task = await TaskModel.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Only assigner can update task details
    const isAssigner =
      (typeof task.assigner === "object" &&
      task.assigner !== null &&
      task.assigner._id
        ? String(task.assigner._id)
        : String(task.assigner)) === String(userId);

    if (!isAssigner) {
      return res.status(403).json({
        success: false,
        message: "Only task creator can update task details",
      });
    }

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (assignees !== undefined) task.assignees = assignees;
    if (status !== undefined) task.status = status;

    await task.save();

    // Populate before returning
    const updatedTask = await TaskModel.findById(task._id)
      .populate("assignees", "name email")
      .populate("assigner", "name email");

    res.json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
});
