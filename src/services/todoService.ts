import { BASE_URL } from "./api";
import type {
  BulkDeleteTodosPayload,
  BulkUpdateTodoStatusPayload,
  CreateTodoPayload,
  GetTodosParams,
  Todo,
  TodoListResponse,
  UpdateTodoPayload,
} from "../interfaces/todo.interface";

const TODO_API = `${BASE_URL}/api/todos`;

const buildQueryString = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "") {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

export const createTodo = async (data: CreateTodoPayload): Promise<Todo> => {
  const response = await fetch(TODO_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create todo");
  }

  return result;
};

export const getTodosByUserId = async (
  params: GetTodosParams
): Promise<TodoListResponse> => {
  const queryString = buildQueryString({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
    sortBy: params.sortBy ?? "createdAt",
    order: params.order ?? "desc",
    completed:
      params.completed === ""
        ? ""
        : params.completed === undefined
        ? ""
        : String(params.completed),
    priority: params.priority ?? "",
    search: params.search ?? "",
  });

  const response = await fetch(
    `${TODO_API}/user/${params.userId}?${queryString}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch todos");
  }

  return result;
};

export const getTodoById = async (id: string): Promise<Todo> => {
  const response = await fetch(`${TODO_API}/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch todo");
  }

  return result;
};

export const updateTodo = async (
  id: string,
  data: UpdateTodoPayload
): Promise<Todo> => {
  const response = await fetch(`${TODO_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to update todo");
  }

  return result;
};

export const deleteTodo = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${TODO_API}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete todo");
  }

  return result;
};

export const bulkUpdateTodoStatus = async (
  data: BulkUpdateTodoStatusPayload
): Promise<{ message: string; modifiedCount: number }> => {
  const response = await fetch(`${TODO_API}/bulk-update-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to bulk update todos");
  }

  return result;
};

export const bulkDeleteTodos = async (
  data: BulkDeleteTodosPayload
): Promise<{ message: string; deletedCount: number }> => {
  const response = await fetch(`${TODO_API}/bulk-delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to bulk delete todos");
  }

  return result;
};