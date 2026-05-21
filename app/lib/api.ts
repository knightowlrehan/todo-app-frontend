const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface TodoImage {
  imageId: string;
  todoId: string;
  fileName: string;
  s3Key: string;
  uploadedAt: string;
  presignedUrl?: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  images?: TodoImage[];
}

const getApiUrl = (): string => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  return API_URL;
};

// List Todos
export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${getApiUrl()}/todos`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch todos");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// Create Todo
export const createTodo = async (title: string): Promise<Todo> => {
  const res = await fetch(`${getApiUrl()}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  return res.json();
};

// Get Todo by ID
export const getTodo = async (id: string): Promise<Todo> => {
  const res = await fetch(`${getApiUrl()}/todos/${id}`);
  if (!res.ok) throw new Error("Failed to fetch todo");
  return res.json();
};

// Update Todo
export const updateTodo = async (
  id: string,
  title: string,
  completed: boolean,
): Promise<Todo> => {
  const res = await fetch(`${getApiUrl()}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed }),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
};

// Delete Todo
export const deleteTodo = async (id: string): Promise<void> => {
  const res = await fetch(`${getApiUrl()}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete todo");
};

// Image API functions
export const uploadImage = async (
  todoId: string,
  file: File,
): Promise<TodoImage> => {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(",")[1];
        const res = await fetch(`${getApiUrl()}/images/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            todoId,
            fileName: file.name,
            fileData: base64Data,
            mimeType: file.type,
          }),
        });
        if (!res.ok) throw new Error("Failed to upload image");
        resolve(res.json());
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const getImageUrl = async (
  todoId: string,
  imageId: string,
): Promise<string> => {
  const res = await fetch(`${getApiUrl()}/images/${todoId}/${imageId}`);
  if (!res.ok) throw new Error("Failed to get image URL");
  const data = await res.json();
  return data.presignedUrl;
};

export const deleteImage = async (
  todoId: string,
  imageId: string,
): Promise<void> => {
  const res = await fetch(`${getApiUrl()}/images/${todoId}/${imageId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete image");
};
