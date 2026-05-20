const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
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
