import {
  useState,
  type FormEvent,
} from "react";

interface TaskFormProps {
  onCreate: (
    title: string,
    note: string | null,
  ) => Promise<void>;
}

export default function TaskForm({
  onCreate,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    try {
      setSubmitting(true);

      await onCreate(
        cleanTitle,
        note.trim() || null,
      );

      setTitle("");
      setNote("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="task-title"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Task title
        </label>

        <input
          id="task-title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="What needs to be done?"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label
          htmlFor="task-note"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Note
        </label>

        <textarea
          id="task-note"
          value={note}
          onChange={(event) =>
            setNote(event.target.value)
          }
          placeholder="Add extra details"
          rows={3}
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}