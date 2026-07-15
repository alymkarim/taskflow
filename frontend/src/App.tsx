import {
  useEffect,
  useState,
} from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./api/tasks";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import type { Task } from "./types/task";

import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        setError(null);

        const taskData = await getTasks();

        setTasks(taskData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load tasks",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadTasks();
  }, []);

  async function handleCreate(
    title: string,
    note: string | null,
  ) {
    try {
      setError(null);

      const newTask = await createTask({
        title,
        note,
      });

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not create task",
      );

      throw error;
    }
  }

  async function handleToggle(task: Task) {
    try {
      setError(null);

      const updatedTask = await updateTask(
        task.id,
        {
          completed: !task.completed,
        },
      );

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not update task",
      );
    }
  }

  async function handleDelete(taskId: number) {
    try {
      setError(null);

      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not delete task",
      );
    }
  }

  const completedCount = tasks.filter(
    (task) => task.completed,
  ).length;

  return (
    <main className="app-container">
      <section className="task-panel">
        <header>
          <p className="app-label">TASKFLOW</p>

          <h1>Plan your day</h1>

          <p className="summary">
            {completedCount} of {tasks.length} tasks
            completed
          </p>
        </header>

        <TaskForm onCreate={handleCreate} />

        {error && (
          <p className="error-message">{error}</p>
        )}

        <section className="task-section">
          <h2>Your tasks</h2>

          {loading ? (
            <p className="empty-message">
              Loading tasks...
            </p>
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </section>
      </section>
    </main>
  );
}