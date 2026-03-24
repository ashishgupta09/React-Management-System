import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLoading(false);
  };

  const isAuthenticated = !!token;

  const checkAuth = () => {
    return !!token;
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      loading,
      login,
      logout,
      checkAuth,
    }),
    [isAuthenticated, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}