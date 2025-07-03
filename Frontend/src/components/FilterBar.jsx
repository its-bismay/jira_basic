import React from 'react';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'ToDo', value: 'ToDo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
  { label: 'Deadline Approaching', value: 'deadline' },
];

const FilterBar = ({ filter, onChange }) => {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1 rounded-full border text-sm font-medium transition ${filter === f.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar; 