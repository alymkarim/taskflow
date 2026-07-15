import type { Task } from "../types/task";

import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <h3 className="font-semibold text-slate-800">
          No tasks found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Create a task or change the selected filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}