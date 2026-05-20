"use client";
import { FormEvent, useState } from "react";
import Button from "../ui/button";
import Label from "../ui/label";

type TodoFormProps = {
  onCreate: (title: string) => Promise<void>;
};

function TodoForm({ onCreate }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreate(trimmedTitle);
      setTitle("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur"
    >
      <Label htmlFor="todo-title" className="mb-2 block">
        Add a new task
      </Label>
      <div className="flex gap-2">
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Pay bills, Walk the dog..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-700 outline-none transition focus:border-blue-500"
        />
        <Button type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </div>
    </form>
  );
}

export default TodoForm;
