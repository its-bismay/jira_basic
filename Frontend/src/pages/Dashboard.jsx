import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FilterDropdown from "../components/FilterDropdown";
import KanbanColumn from "../components/KanbanColumn";
import AddTaskButton from "../components/AddTaskButton";
import TaskModal from "../components/TaskModal";
import axios from "axios";
import { toast } from "react-toastify";

const columns = [
  { title: "ToDo", status: "ToDo" },
  { title: "In Progress", status: "In Progress" },
  { title: "Done", status: "Done" },
];

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("assignedToMe");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const refreshTasks = () => {
    setTasksLoading(true);
    const endpoint =
      tab === "assignedToMe"
        ? "http://localhost:8080/api/assigned-to-me"
        : "http://localhost:8080/api/assigned-by-me";

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setTasks(res.data.tasks || []);
        } else {
          toast.error(res.data.message || "Failed to fetch tasks");
        }
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        toast.error(err.response?.data?.message || "Failed to fetch tasks");
        setTasks([]);
      })
      .finally(() => setTasksLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    refreshTasks();
    // eslint-disable-next-line
  }, [tab, token]);

  // Fetch users from backend
  useEffect(() => {
    if (!showTaskModal || !token) return;
    setUsersLoading(true);
    axios
      .get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.users || []);
      })
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false));
  }, [showTaskModal, token]);

  // Filtering logic
  const getFilteredTasks = (tasks) =>
    tasks.filter((task) => {
      if (filter === "all") return true;
      if (filter === "deadline") {
        const now = new Date();
        const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        return new Date(task.dueDate) <= in3Days && task.status !== "Done";
      }
      return task.status === filter;
    });

  const filteredTasks = getFilteredTasks(tasks);

  // Handle task creation
  const handleAddTask = async (values) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/create/task",
        {
          title: values.title,
          description: values.description,
          dueDate: values.dueDate,
          priority: values.priority,
          assignees: values.assignees, // array of user IDs
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        toast.success("Task created successfully!");
        refreshTasks();
        setShowTaskModal(false);
        setEditingTask(null);
      } else {
        toast.error(res.data.message || "Failed to create task");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  // Handle task status update
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:8080/api/${taskId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        toast.success("Task status updated!");
        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update task status");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update task status"
      );
    }
  };

  // Open modal for editing
  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Handle update task
  const handleUpdateTask = async (values) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/${editingTask._id}`,
        {
          title: values.title,
          description: values.description,
          dueDate: values.dueDate,
          priority: values.priority,
          assignees: values.assignees,
          status: values.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        toast.success("Task updated successfully!");
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === editingTask._id ? res.data.task : task
          )
        );
        refreshTasks();
        setShowTaskModal(false);
        setEditingTask(null);
      } else {
        toast.error(res.data.message || "Failed to update task");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await axios.delete(`http://localhost:8080/api/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Task deleted successfully!");
        // Remove from local state
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      } else {
        toast.error(res.data.message || "Failed to delete task");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar onLogout={logout} />
      <Sidebar currentTab={tab} onTabChange={setTab} />
      <main className="pl-56 pt-20 pr-8 pb-8 min-h-screen relative overflow-hidden">
        {/* Dot grid background */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #dbeafe 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
          }}
        />
        <div className="relative z-10">
          <div className="flex flex-row items-center justify-between mb-6 w-full">
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">
                Dashboard
              </div>
              <div className="text-blue-600 text-lg mb-2">
                Welcome,{" "}
                {user?.name
                  ? user.name
                  : user?.email
                  ? user.email.split("@")[0]
                  : "User"}
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <FilterDropdown filter={filter} onChange={setFilter} />
            </div>
          </div>

          {tasksLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {columns.map((col) => (
                <KanbanColumn
                  key={col.status}
                  title={col.title}
                  tasks={filteredTasks.filter(
                    (task) => task.status === col.status
                  )}
                  onStatusUpdate={handleStatusUpdate}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
        <AddTaskButton onClick={() => setShowTaskModal(true)} />
        <TaskModal
          open={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          users={users}
          usersLoading={usersLoading}
          initialValues={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description,
                  dueDate: editingTask.dueDate
                    ? new Date(editingTask.dueDate).toISOString().slice(0, 10)
                    : "",
                  priority: editingTask.priority,
                  assignees: editingTask.assignees.map((a) => a._id || a),
                  status: editingTask.status,
                }
              : undefined
          }
          isEdit={!!editingTask}
        />
      </main>
    </div>
  );
};

export default Dashboard;
