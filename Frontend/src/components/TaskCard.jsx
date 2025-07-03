import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";

const priorityColors = {
  Low: "bg-green-100 text-green-700",
  Med: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

const TaskCard = ({ task, onEdit, onStatusUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [showAssignees, setShowAssignees] = useState(false);
  const actionsRef = useRef(null);
  const assigneeRef = useRef(null);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
      if (assigneeRef.current && !assigneeRef.current.contains(event.target)) {
        setShowAssignees(false);
      }
    };
    if (showActions || showAssignees) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions, showAssignees]);

  // Handle ESC to close popover
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowAssignees(false);
        setShowActions(false);
      }
    };
    if (showActions || showAssignees) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showActions, showAssignees]);

  // Assignee display logic
  const getAssigneeDisplay = () => {
    if (!task.assignees || task.assignees.length === 0) return "Unassigned";
    if (task.assignees.length === 1) {
      return task.assignees[0].name || task.assignees[0].email || "Unknown";
    }
    const first =
      task.assignees[0].name || task.assignees[0].email || "Unknown";
    return `${first} +${task.assignees.length - 1} more`;
  };

  // Permission checks
  const isAssigner =
    user &&
    task.assigner &&
    (typeof task.assigner === "object" &&
    task.assigner !== null &&
    task.assigner._id
      ? String(task.assigner._id)
      : String(task.assigner)) === String(user._id);
  // Debug log
  // console.log('Task:', task.title, 'Assigner:', task.assigner, 'User:', user, 'isAssigner:', isAssigner);

  // Status change
  const handleStatusChange = (newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(task._id, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-blue-100 hover:shadow-2xl transition-shadow relative group">
      {/* Delete icon (top right) if assigner */}
      {isAssigner && (
        <button
          onClick={() => onDelete && onDelete(task._id)}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full transition"
          title="Delete Task"
        >
          {/* Trash SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-blue-700 text-lg truncate max-w-[70%]">
          {task.title}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            priorityColors[task.priority] || ""
          }`}
        >
          {task.priority}
        </span>
      </div>
      <div className="text-sm text-gray-700 mb-2 line-clamp-3">
        {task.description}
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span>
          Due:{" "}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
        </span>
        {/* Assignee popover */}
        <div className="relative" ref={assigneeRef}>
          <button
            type="button"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
            onClick={() => setShowAssignees((v) => !v)}
            title="View all assignees"
          >
            {getAssigneeDisplay()}
            {task.assignees && task.assignees.length > 1 && (
              <svg
                className="inline ml-1 w-3 h-3 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
          {showAssignees && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-blue-100 rounded-lg shadow-xl z-20 p-2 animate-fade-in">
              <div className="font-semibold text-blue-700 mb-2 text-sm">
                Assignees
              </div>
              <ul>
                {task.assignees &&
                  task.assignees.map((a) => (
                    <li
                      key={a._id || a.email}
                      className="py-1 px-2 rounded hover:bg-blue-50 text-gray-700 flex flex-col"
                    >
                      <span className="font-medium">{a.name || a.email}</span>
                      <span className="text-xs text-gray-400">{a.email}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Status dropdown and actions */}
      <div className="flex justify-between items-center mt-2 gap-2">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 border-none focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="ToDo">ToDo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <div className="flex gap-2 items-center" ref={actionsRef}>
          {isAssigner && (
            <button
              onClick={() => onEdit && onEdit(task)}
              className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow"
            >
              Update
            </button>
          )}
          <button
            onClick={() => setShowActions((v) => !v)}
            className="text-gray-500 hover:text-blue-600 text-xs p-1"
            title="More actions"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19.5" cy="12" r="1.5" />
              <circle cx="4.5" cy="12" r="1.5" />
            </svg>
          </button>
          {showActions && (
            <div className="absolute right-0 top-10 bg-white border rounded shadow-lg z-10 min-w-[100px]">
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(task._id);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Show assigner info if available */}
      {task.assigner && (
        <div className="text-xs text-gray-400 mt-3">
          Created by: {task.assigner.name || task.assigner.email}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
