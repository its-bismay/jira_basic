import React from "react";

const Sidebar = ({ currentTab, onTabChange }) => (
  <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 bg-white shadow flex flex-col pt-8 z-10">
    <button
      className={`text-left px-6 py-3 font-semibold text-lg transition border-l-4 ${
        currentTab === "assignedToMe"
          ? "border-blue-600 text-blue-700 bg-blue-50"
          : "border-transparent text-blue-500 hover:bg-blue-50"
      }`}
      onClick={() => onTabChange("assignedToMe")}
    >
      Assigned to Me
    </button>
    <button
      className={`text-left px-6 py-3 font-semibold text-lg transition border-l-4 ${
        currentTab === "assignedByMe"
          ? "border-blue-600 text-blue-700 bg-blue-50"
          : "border-transparent text-blue-500 hover:bg-blue-50"
      }`}
      onClick={() => onTabChange("assignedByMe")}
    >
      Assigned by Me
    </button>
  </aside>
);

export default Sidebar;
