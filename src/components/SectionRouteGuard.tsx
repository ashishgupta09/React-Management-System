import { Navigate } from "react-router-dom";
import type { Permission } from "../interfaces/auth.interface";
import { useAuth } from "../context/AuthContext";

interface SectionRouteGuardProps {
  permission: Permission;
  children: React.ReactNode;
}

function SectionRouteGuard({ permission, children }: SectionRouteGuardProps) {
  const { hasPermission, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/home/overview" replace />;
  }

  return <>{children}</>;
}

export default SectionRouteGuard;