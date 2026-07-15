import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <li
      className={
        task.completed
          ? "task-item task-completed"
          : "task-item"
      }
    >
      <button
        type="button"
        className="complete-button"
        onClick={() => void onToggle(task)}
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-details">
        <h3>{task.title}</h3>

        {task.note && <p>{task.note}</p>}
      </div>

      <button
        type="button"
        className="delete-button"
        onClick={() => void onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  );
}