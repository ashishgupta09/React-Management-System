import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "var(--bg-primary)",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            border: "4px solid var(--border-color)",
                            borderTop: "4px solid var(--button-primary)",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto 16px",
                        }}
                    />
                    <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
