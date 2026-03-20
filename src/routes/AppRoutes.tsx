import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardLayout from "../pages/dashboard/DashboardLayout";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default route */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard route */}
                <Route path="/home" element={<DashboardLayout />} />

                {/* Invalid routes */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;