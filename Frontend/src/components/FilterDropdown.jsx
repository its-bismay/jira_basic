import React from "react";

const filters = [
  { label: "All", value: "all" },
  { label: "ToDo", value: "ToDo" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
  { label: "Deadline Approaching", value: "deadline" },
];

const FilterDropdown = ({ filter, onChange }) => (
  <div className="relative">
    <select
      value={filter}
      onChange={(e) => onChange(e.target.value)}
      className="block w-48 px-4 py-2 border border-blue-200 rounded bg-white text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {filters.map((f) => (
        <option key={f.value} value={f.value}>
          {f.label}
        </option>
      ))}
    </select>
  </div>
);

export default FilterDropdown;
