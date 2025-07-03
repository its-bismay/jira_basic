import React from "react";

const AddTaskButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-8 right-8 z-30 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition group"
    title="Add Task"
  >
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
    <span className="absolute bottom-20 right-0 bg-blue-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
      Add Task
    </span>
  </button>
);

export default AddTaskButton;
