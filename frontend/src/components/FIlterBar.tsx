export type TaskFilter =
  | "all"
  | "active"
  | "completed";

interface FilterBarProps {
  currentFilter: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}

const filters: TaskFilter[] = [
  "all",
  "active",
  "completed",
];

export default function FilterBar({
  currentFilter,
  onChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={
            currentFilter === filter
              ? "rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold capitalize text-white"
              : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
          }
        >
          {filter}
        </button>
      ))}
    </div>
  );
}