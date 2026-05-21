"use client";
import { FormEvent, useState } from "react";
import { Todo, TodoImage } from "../lib/api";
import Button from "../ui/button";
import Label from "../ui/label";
import ImageUpload from "./image-upload";
import ImageGallery from "./image-gallery";

type TodoItemProps = {
  todo: Todo;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string, completed: boolean) => Promise<void>;
  onImageUploaded?: (todoId: string, image: TodoImage) => Promise<void>;
  onImageDeleted?: (todoId: string, imageId: string) => Promise<void>;
};

function TodoItem({
  todo,
  onDelete,
  onUpdate,
  onImageUploaded,
  onImageDeleted,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<TodoImage[]>(todo.images || []);

  const handleToggle = async () => {
    try {
      setIsSubmitting(true);
      await onUpdate(todo.id, todo.title, !todo.completed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = editedTitle.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);
      await onUpdate(todo.id, trimmed, todo.completed);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await onDelete(todo.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = async (image: TodoImage) => {
    setImages((current) => [...current, image]);
    if (onImageUploaded) {
      await onImageUploaded(todo.id, image);
    }
  };

  const handleImageDeleted = async (imageId: string) => {
    setImages((current) => current.filter((img) => img.imageId !== imageId));
    if (onImageDeleted) {
      await onImageDeleted(todo.id, imageId);
    }
  };

  return (
    <li className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <Label htmlFor={`todo-${todo.id}`} className="sr-only">
          Mark {todo.title} as completed
        </Label>
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={() => void handleToggle()}
          disabled={isSubmitting}
          className="mt-1 h-4 w-4 accent-emerald-600"
        />
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <form onSubmit={handleSave} className="flex gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 outline-none focus:border-blue-500"
              />
              <Button type="submit" disabled={isSubmitting} size="sm" variant="primary">
                Save
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setEditedTitle(todo.title);
                  setIsEditing(false);
                }}
                size="sm"
                variant="secondary"
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <p
                className={`font-medium ${todo.completed ? "text-slate-400 line-through" : "text-slate-800"}`}
              >
                {todo.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(todo.createdAt).toLocaleString()}
              </p>
              {images.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  📷 {images.length} image{images.length !== 1 ? "s" : ""}
                </p>
              )}
            </>
          )}
        </div>
        {!isEditing && (
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="secondary"
            >
              Edit
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => void handleDelete()}
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 pl-7 space-y-3 border-l-2 border-slate-200">
        <ImageUpload todoId={todo.id} onImageUploaded={handleImageUploaded} />
        <ImageGallery
          todoId={todo.id}
          images={images}
          onImageDeleted={handleImageDeleted}
        />
      </div>
    </li>
  );
}

export default TodoItem;
