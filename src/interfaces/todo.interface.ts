export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  _id: string;
  userId: string;
  todo: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoPayload {
  userId: string;
  todo: string;
  completed?: boolean;
  priority: TodoPriority;
}

export interface UpdateTodoPayload {
  todo?: string;
  completed?: boolean;
  priority?: TodoPriority;
}

export interface GetTodosParams {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  completed?: boolean | "";
  priority?: TodoPriority | "";
  search?: string;
}

export interface TodoListResponse {
  todos: Todo[];
  total: number;
  page: number;
  pages: number;
}

export interface BulkUpdateTodoStatusPayload {
  ids: string[];
  updates: UpdateTodoPayload;
}

export interface UpdateTodoPayload {
  completed?: boolean;
  priority?: "low" | "medium" | "high";
}

export interface BulkDeleteTodosPayload {
  ids: string[];
}