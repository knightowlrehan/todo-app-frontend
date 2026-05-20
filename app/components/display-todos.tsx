"use client";

import { useEffect, useState } from "react";
import {
  createTodo,
  deleteTodo,
  getTodos,
  type Todo,
  updateTodo,
} from "../lib/api";
import TodoForm from "./todo-form";
import TodoItem from "./todo-item";

function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadTodos = async () => {
    try {
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadTodos();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleCreateTodo = async (title: string) => {
    try {
      setError(null);
      const newTodo = await createTodo(title);
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  };

  const handleUpdateTodo = async (
    id: string,
    title: string,
    completed: boolean,
  ) => {
    try {
      setError(null);
      const updated = await updateTodo(id, title, completed);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updated : todo)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <section className="mx-auto my-10 max-w-2xl px-4">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          My TODO list
        </h1>
        <div className="mt-4 flex justify-center gap-3 text-sm">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
            Total: {todos.length}
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
            Completed: {completedCount}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
            Pending: {pendingCount}
          </span>
        </div>
      </div>
      <TodoForm onCreate={handleCreateTodo} />
      {loading && (
        <p className="mt-3 text-center text-slate-500">Loading todos...</p>
      )}
      {error && (
        <p className="mb-3 mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </p>
      )}
      {!loading && !error && todos.length === 0 && (
        <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-center text-slate-600">
          No todos found. Add one to get started.
        </p>
      )}
      {!loading && !error && todos.length > 0 && (
        <ul className="mt-4 space-y-3">
          {todos.map((todo) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Todos;
