"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" or "completed"
  const [error, setError] = useState(null);

  // State for modal editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  // Local state for editing fields
  const [editDescription, setEditDescription] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editPriority, setEditPriority] = useState("MEDIUM");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/todo", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) router.push("/auth/login");
        throw new Error("Failed to fetch tasks");
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete a task
  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/todo/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Mark a task as completed
  const handleComplete = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/todo/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });
      if (!res.ok) {
        throw new Error("Failed to update task");
      }
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Open modal for editing
  const openEditModal = (task) => {
    setCurrentTask(task);
    setEditDescription(task.description);
    setEditCompleted(task.completed);
    // Convert the ISO date to a format acceptable by datetime-local input
    const localDate = new Date(task.date).toISOString().slice(0, 16);
    setEditDate(localDate);
    setEditPriority(task.priority || "MEDIUM");
    setIsModalOpen(true);
  };

  // Submit updated task via PATCH
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!currentTask) return;
    try {
      const res = await fetch(`http://localhost:3000/todo/${currentTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: editDescription,
          completed: editCompleted,
          // Convert the local datetime to ISO string
          date: new Date(editDate).toISOString(),
          priority: editPriority,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update task");
      }
      // Update tasks list with new data
      const updatedTask = await res.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      setIsModalOpen(false);
      setCurrentTask(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter tasks based on filter state
  const displayedTasks =
    filter === "completed" ? tasks.filter((task) => task.completed) : tasks;

  return (
    <div>
      <h1>Your Tasks</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => router.push("/todoform")}>Add Task</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Filter buttons */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setFilter("all")}>Show All Tasks</button>
        <button onClick={() => setFilter("completed")}>
          Show Completed Tasks
        </button>
      </div>

      <ul>
        {displayedTasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "1rem" }}>
            <strong>{task.description}</strong>{" "}
            {task.completed && <span>(Completed)</span>}
            <div>{new Date(task.date).toLocaleDateString()}</div>
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
              {!task.completed && (
                <button onClick={() => handleComplete(task.id)}>
                  Mark as Completed
                </button>
              )}
              <button onClick={() => openEditModal(task)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "4px",
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <h2>Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>
                  Description:
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Completed:
                  <input
                    type="checkbox"
                    checked={editCompleted}
                    onChange={(e) => setEditCompleted(e.target.checked)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Date and Time:
                  <input
                    type="datetime-local"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Priority:
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </label>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <button type="submit">Save Changes</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentTask(null);
                  }}
                  style={{ marginLeft: "1rem" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
