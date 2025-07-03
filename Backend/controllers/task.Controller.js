import { TaskModel } from "../Models/task.js";
import { UserModel } from "../Models/user.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignees } = req.body;
    const assigner = req.user._id; // assuming you have auth middleware that sets req.user

    // Check if assignee exists
    const assigneeUser = await UserModel.findById(assignees);
    if (!assigneeUser) {
      return res.status(404).json({
        message: "Assignee user not found",
        success: false,
      });
    }

    const task = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      assignees,
      assigner,
    });

    await task.save();

    return res.status(201).json({
      message: "Task created successfully",
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      success: false,
      error,
    });
  }
};
