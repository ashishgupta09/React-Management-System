import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, Permission, UserRole } from "../interfaces/auth.interface";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_TOKEN_KEY = "token";
const STORAGE_USER_KEY = "auth_user";

const allPermissions: Permission[] = [
  "view_overview",
  "view_users",
  "manage_users",
  "view_reports",
  "view_tasks",
  "manage_tasks",
  "manage_settings",
];

const getPermissionsByRole = (role: UserRole): Permission[] => {
  switch (role) {
    case "ADMIN":
      return [...allPermissions];
    case "MANAGER":
      return [
        "view_overview",
        "view_users",
        "manage_users",
        "view_reports",
        "view_tasks",
        "manage_tasks",
      ];
    case "USER":
    default:
      return ["view_overview", "view_tasks"];
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as Partial<AuthUser>;

        const safeRole: UserRole =
          parsedUser.role === "ADMIN" ||
          parsedUser.role === "MANAGER" ||
          parsedUser.role === "USER"
            ? parsedUser.role
            : "USER";

        setUser({
          id: parsedUser.id || "",
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          role: safeRole,
          permissions: Array.isArray(parsedUser.permissions)
            ? parsedUser.permissions
            : getPermissionsByRole(safeRole),
        });
      } catch {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, loggedInUser: AuthUser) => {
    const safeRole: UserRole =
      loggedInUser.role === "ADMIN" ||
      loggedInUser.role === "MANAGER" ||
      loggedInUser.role === "USER"
        ? loggedInUser.role
        : "USER";

    const safeUser: AuthUser = {
      ...loggedInUser,
      role: safeRole,
      permissions: Array.isArray(loggedInUser.permissions)
        ? loggedInUser.permissions
        : getPermissionsByRole(safeRole),
    };

    localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(safeUser));

    setToken(newToken);
    setUser(safeUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const hasPermission = (permission: Permission) => {
    if (!user || !Array.isArray(user.permissions)) {
      return false;
    }

    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    return user.role === role;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
      hasPermission,
      hasRole,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}