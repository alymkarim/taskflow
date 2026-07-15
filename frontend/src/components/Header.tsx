interface HeaderProps {
  total: number;
  completed: number;
}

export default function Header({
  total,
  completed,
}: HeaderProps) {
  const remaining = total - completed;

  return (
    <header className="space-y-6">
      <div>
        <p className="text-sm font-bold tracking-[0.25em] text-indigo-600">
          TASKFLOW
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Plan your day
        </h1>

        <p className="mt-3 text-slate-500">
          Organise your tasks and keep moving.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total tasks
          </p>

          <strong className="mt-2 block text-3xl text-slate-950">
            {total}
          </strong>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <strong className="mt-2 block text-3xl text-emerald-600">
            {completed}
          </strong>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Remaining
          </p>

          <strong className="mt-2 block text-3xl text-indigo-600">
            {remaining}
          </strong>
        </article>
      </section>
    </header>
  );
}