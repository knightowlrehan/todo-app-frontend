"use client";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Button from "../ui/button";
import Label from "../ui/label";

type TodoFormProps = {
  onCreate: (title: string, file?: File) => Promise<void>;
};

function TodoForm({ onCreate }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreate(trimmedTitle, selectedFile || undefined);
      setTitle("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
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
      <div className="flex gap-2 mb-3">
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Pay bills, Walk the dog..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-700 outline-none transition focus:border-blue-500"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          id="todo-image"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isSubmitting}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting}
          size="sm"
          variant="secondary"
        >
          📷 Add Image
        </Button>
        {selectedFile && (
          <span className="text-xs text-slate-600">{selectedFile.name}</span>
        )}
        {selectedFile && (
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            disabled={isSubmitting}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Remove
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </form>
  );
}

export default TodoForm;
