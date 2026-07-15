import type {
  Task,
  TaskCreate,
  TaskUpdate,
} from "../types/task";

const API_URL = "http://127.0.0.1:8000";

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as {
        detail?: string;
      };

      if (errorBody.detail) {
        errorMessage = errorBody.detail;
      }
    } catch {
      // The response may not contain JSON.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  return handleResponse<Task[]>(response);
}

export async function createTask(
  task: TaskCreate,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Could not create task: ${response.status} ${errorBody}`,
    );
  }

  return response.json() as Promise<Task>;
}

export async function updateTask(
  taskId: number,
  changes: TaskUpdate,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    },
  );

  return handleResponse<Task>(response);
}

export async function deleteTask(
  taskId: number,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
    },
  );

  return handleResponse<Task>(response);
}