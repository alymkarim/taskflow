import type {
  Task,
  TaskCreate,
  TaskUpdate,
} from "../types/task";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    options,
  );

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const body = (await response.json()) as {
        detail?: string;
      };

      if (body.detail) {
        message = body.detail;
      }
    } catch {
      // The response did not contain JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function getTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks");
}

export function createTask(
  task: TaskCreate,
): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

export function updateTask(
  taskId: number,
  updates: TaskUpdate,
): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
}

export function deleteTask(
  taskId: number,
): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}