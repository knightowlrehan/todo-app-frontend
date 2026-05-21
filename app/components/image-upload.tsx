"use client";
import { FormEvent, useRef, useState } from "react";
import { uploadImage, TodoImage } from "../lib/api";
import Button from "../ui/button";

type ImageUploadProps = {
  todoId: string;
  onImageUploaded: (image: TodoImage) => Promise<void>;
};

function ImageUpload({ todoId, onImageUploaded }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setSelectedFileName(file.name);
    setError(null);

    try {
      setIsUploading(true);
      const uploadedImage = await uploadImage(todoId, file);
      await onImageUploaded(uploadedImage);
      setSelectedFileName(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">Upload image</p>
          <p className="text-xs text-slate-500">Select an image to attach it to this todo.</p>
        </div>
        <input
          ref={fileInputRef}
          id={`image-upload-${todoId}`}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="sm"
          variant="secondary"
        >
          {isUploading ? "Uploading..." : "Choose image"}
        </Button>
        {selectedFileName && (
          <span className="truncate text-sm text-slate-600">{selectedFileName}</span>
        )}
      </div>
      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default ImageUpload;
