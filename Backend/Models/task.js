import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["Low", "Med", "High"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["ToDo", "In Progress", "Done"],
      default: "ToDo",
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    ],
    assigner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model("tasks", TaskSchema);
