import React from "react";
import TaskCard from "./TaskCard";

const KanbanColumn = ({ title, tasks, onEdit, onStatusUpdate, onDelete }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-3 w-full min-w-[250px] max-w-xs flex-1">
      <h2 className="text-blue-700 font-bold mb-3 text-center">{title}</h2>
      <div>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onStatusUpdate={onStatusUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-gray-400 text-sm text-center py-4">No tasks</div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
