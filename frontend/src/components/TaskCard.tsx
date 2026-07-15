import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export default function TaskCard({
  task,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => void onToggle(task)}
        aria-label={
          task.completed
            ? "Mark task as incomplete"
            : "Mark task as complete"
        }
        className={
          task.completed
            ? "grid size-7 shrink-0 place-items-center rounded-full bg-emerald-500 font-bold text-white"
            : "size-7 shrink-0 rounded-full border-2 border-slate-300 transition hover:border-indigo-500"
        }
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="min-w-0 flex-1">
        <h3
          className={
            task.completed
              ? "break-words font-semibold text-slate-400 line-through"
              : "break-words font-semibold text-slate-900"
          }
        >
          {task.title}
        </h3>

        {task.note && (
          <p className="mt-1 break-words text-sm leading-6 text-slate-500">
            {task.note}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => void onDelete(task.id)}
        className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
      >
        Delete
      </button>
    </article>
  );
}