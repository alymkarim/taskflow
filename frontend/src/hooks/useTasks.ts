import { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../api/tasks";

import type { Task } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    void loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);

      const data = await getTasks();

      setTasks(data);
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

  async function addTask(
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

  async function toggleTask(task: Task) {
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

  async function removeTask(taskId: number) {
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

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    removeTask,
  };
}