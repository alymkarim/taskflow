const API_URL = "http://127.0.0.1:8000/tasks";

interface Task {
    id: number;
    title: string;
    note: string | null;
    completed: boolean;
}

type TaskFilter = "all" | "active" | "completed";

const taskForm = document.querySelector<HTMLFormElement>("#task-form");
const titleInput =
    document.querySelector<HTMLInputElement>("#task-title");
const noteInput =
    document.querySelector<HTMLTextAreaElement>("#task-note");

const submitButton =
    document.querySelector<HTMLButtonElement>("#submit-button");

const taskList =
    document.querySelector<HTMLDivElement>("#task-list");

const taskCount =
    document.querySelector<HTMLSpanElement>("#task-count");

const loadingMessage =
    document.querySelector<HTMLParagraphElement>("#loading-message");

const apiError =
    document.querySelector<HTMLParagraphElement>("#api-error");

const formError =
    document.querySelector<HTMLParagraphElement>("#form-error");

const emptyState =
    document.querySelector<HTMLDivElement>("#empty-state");

const filterButtons =
    document.querySelectorAll<HTMLButtonElement>(".filter-button");

if (
    !taskForm ||
    !titleInput ||
    !noteInput ||
    !submitButton ||
    !taskList ||
    !taskCount ||
    !loadingMessage ||
    !apiError ||
    !formError ||
    !emptyState
) {
    throw new Error("A required HTML element could not be found.");
}

let tasks: Task[] = [];
let activeFilter: TaskFilter = "all";

async function request<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;

        try {
            const errorBody = await response.json();

            if (typeof errorBody.detail === "string") {
                errorMessage = errorBody.detail;
            }
        } catch {
            // The response did not contain JSON.
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

function getFilteredTasks(): Task[] {
    if (activeFilter === "active") {
        return tasks.filter((task) => !task.completed);
    }

    if (activeFilter === "completed") {
        return tasks.filter((task) => task.completed);
    }

    return tasks;
}

function createTaskElement(task: Task): HTMLElement {
    const card = document.createElement("article");
    card.className = "task-card";

    if (task.completed) {
        card.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
        "aria-label",
        `Mark ${task.title} as ${
            task.completed ? "active" : "completed"
        }`
    );

    checkbox.addEventListener("change", async () => {
        checkbox.disabled = true;

        try {
            await updateTask(task.id, {
                completed: checkbox.checked,
            });
        } catch (error) {
            checkbox.checked = task.completed;
            showApiError(error);
        } finally {
            checkbox.disabled = false;
        }
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("h3");
    title.textContent = task.title;

    content.appendChild(title);

    if (task.note) {
        const note = document.createElement("p");
        note.textContent = task.note;
        content.appendChild(note);
    }

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action-button edit-button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", async () => {
        await editTask(task);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-button delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", async () => {
        await removeTask(task);
    });

    actions.append(editButton, deleteButton);
    card.append(checkbox, content, actions);

    return card;
}

function renderTasks(): void {
    taskList.innerHTML = "";

    const visibleTasks = getFilteredTasks();

    visibleTasks.forEach((task) => {
        taskList.appendChild(createTaskElement(task));
    });

    taskCount.textContent =
        `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;

    emptyState.classList.toggle(
        "hidden",
        visibleTasks.length !== 0
    );
}

function showApiError(error: unknown): void {
    if (error instanceof Error) {
        apiError.textContent = error.message;
    } else {
        apiError.textContent = "An unexpected error occurred.";
    }
}

function clearErrors(): void {
    apiError.textContent = "";
    formError.textContent = "";
}

async function loadTasks(): Promise<void> {
    clearErrors();
    loadingMessage.classList.remove("hidden");

    try {
        tasks = await request<Task[]>(API_URL);
        renderTasks();
    } catch (error) {
        showApiError(error);
    } finally {
        loadingMessage.classList.add("hidden");
    }
}

async function createTask(
    title: string,
    note: string
): Promise<void> {
    const newTask = await request<Task>(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            note: note || null,
        }),
    });

    tasks.push(newTask);
    renderTasks();
}

async function updateTask(
    taskId: number,
    changes: Partial<Pick<Task, "title" | "note" | "completed">>
): Promise<void> {
    const updatedTask = await request<Task>(
        `${API_URL}/${taskId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(changes),
        }
    );

    tasks = tasks.map((task) =>
        task.id === taskId ? updatedTask : task
    );

    renderTasks();
}

async function editTask(task: Task): Promise<void> {
    clearErrors();

    const newTitle = window.prompt(
        "Enter the updated task title:",
        task.title
    );

    if (newTitle === null) {
        return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
        apiError.textContent = "The task title cannot be empty.";
        return;
    }

    const newNote = window.prompt(
        "Enter the updated note:",
        task.note ?? ""
    );

    if (newNote === null) {
        return;
    }

    try {
        await updateTask(task.id, {
            title: trimmedTitle,
            note: newNote.trim() || null,
        });
    } catch (error) {
        showApiError(error);
    }
}

async function removeTask(task: Task): Promise<void> {
    clearErrors();

    const confirmed = window.confirm(
        `Delete "${task.title}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        await request<Task>(`${API_URL}/${task.id}`, {
            method: "DELETE",
        });

        tasks = tasks.filter(
            (currentTask) => currentTask.id !== task.id
        );

        renderTasks();
    } catch (error) {
        showApiError(error);
    }
}

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const title = titleInput.value.trim();
    const note = noteInput.value.trim();

    if (!title) {
        formError.textContent = "Please enter a task title.";
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Adding...";

    try {
        await createTask(title, note);

        taskForm.reset();
        titleInput.focus();
    } catch (error) {
        if (error instanceof Error) {
            formError.textContent = error.message;
        } else {
            formError.textContent =
                "The task could not be created.";
        }
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Add task";
    }
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter =
            button.dataset.filter as TaskFilter | undefined;

        if (!selectedFilter) {
            return;
        }

        activeFilter = selectedFilter;

        filterButtons.forEach((currentButton) => {
            currentButton.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
    });
});

void loadTasks();