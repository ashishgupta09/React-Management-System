export type UserRole = "ADMIN" | "MANAGER" | "USER";

export type Permission =
  | "view_overview"
  | "view_users"
  | "manage_users"
  | "view_reports"
  | "view_tasks"
  | "manage_tasks"
  | "manage_settings";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  message?: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message?: string;
  user?: AuthUser;
}