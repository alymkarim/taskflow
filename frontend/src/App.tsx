import { useMemo, useState } from "react";

import FilterBar, {
  type TaskFilter,
} from "./components/FilterBar";

import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import { useTasks } from "./hooks/useTasks";

export default function App() {
  const {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    removeTask,
  } = useTasks();

  const [filter, setFilter] =
    useState<TaskFilter>("all");

  const completedCount = tasks.filter(
    (task) => task.completed,
  ).length;

  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter(
        (task) => !task.completed,
      );
    }

    if (filter === "completed") {
      return tasks.filter(
        (task) => task.completed,
      );
    }

    return tasks;
  }, [filter, tasks]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <Header
          total={tasks.length}
          completed={completedCount}
        />

        <TaskForm onCreate={addTask} />

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Your tasks
            </h2>

            <FilterBar
              currentFilter={filter}
              onChange={setFilter}
            />
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
              Loading tasks...
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={removeTask}
            />
          )}
        </section>
      </div>
    </main>
  );
}