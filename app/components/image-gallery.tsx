"use client";
import { useEffect, useState } from "react";
import { TodoImage, getImageUrl, deleteImage } from "../lib/api";
import Button from "../ui/button";

type ImageGalleryProps = {
  todoId: string;
  images: TodoImage[] | undefined;
  onImageDeleted: (imageId: string) => Promise<void>;
};

type ImageWithUrl = TodoImage & { url: string };

function ImageGallery({ todoId, images, onImageDeleted }: ImageGalleryProps) {
  const [imagesWithUrls, setImagesWithUrls] = useState<ImageWithUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImageUrls = async () => {
      if (!images || images.length === 0) {
        setImagesWithUrls([]);
        return;
      }

      setLoading(true);
      try {
        const urlPromises = images.map(async (image) => {
          const url = await getImageUrl(todoId, image.imageId);
          return { ...image, url };
        });
        const resolved = await Promise.all(urlPromises);
        setImagesWithUrls(resolved);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    loadImageUrls();
  }, [images, todoId]);

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage(todoId, imageId);
      setImagesWithUrls((prev) =>
        prev.filter((img) => img.imageId !== imageId),
      );
      await onImageDeleted(imageId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  return (
    <div className="mt-2 space-y-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            Attached Images
          </h4>
          <p className="text-xs text-slate-500">
            Images are shown below the todo item for easy preview and delete.
          </p>
        </div>
        {loading && <p className="text-xs text-slate-500">Loading images…</p>}
      </div>

      {imagesWithUrls.length === 0 && !loading ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-sm text-slate-500">
          No images yet. Use the uploader above to add one.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imagesWithUrls.map((image) => (
            <div
              key={image.imageId}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative overflow-hidden aspect-square bg-slate-100">
                <img
                  src={image.url}
                  alt={image.fileName}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <Button
                  type="button"
                  onClick={() => void handleDelete(image.imageId)}
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-red-600 shadow-lg shadow-slate-200/70 hover:bg-red-600 hover:text-red-600
                  "
                >
                  ✕
                </Button>
              </div>
              <div className="px-3 py-2">
                <p className="mt-1 text-xs text-slate-500">
                  Uploaded {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default ImageGallery;
