"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTaskPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!description || !date || !priority) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const formattedDate = new Date(date).toISOString();
    try {
      const res = await fetch("http://localhost:3000/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          completed,
          date: formattedDate,
          priority,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      // Redirect to tasks page on successful creation
      router.push("/todos");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Create New Todo</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Completed:
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Priority:
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </label>
        <br />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
