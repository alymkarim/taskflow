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
      className="task-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="task-title">
        Task title
      </label>

      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        placeholder="What needs to be done?"
        required
      />

      <label htmlFor="task-note">
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
      />

      <button
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}