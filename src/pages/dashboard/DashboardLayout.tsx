import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Users from "./Users";
import Reports from "./Reports";
import Settings from "./Settings";
import { Menu, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/dashboard.css";
import TodoList from "./TodoList";

type SectionType = "overview" | "users" | "reports" | "tasks" | "settings";

function DashboardLayout() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState<SectionType>("overview");
    const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

    const sectionComponents: Record<SectionType, JSX.Element> = {
        overview: <Overview />,
        users: <Users />,
        reports: <Reports />,
        tasks: <TodoList />,
        settings: <Settings />,
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            <div
                className={`overlay ${isOpen ? "show-overlay" : ""}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
                <Sidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <button
                            className="header-toggle-btn"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="header-title">Management Dashboard</h2>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <button className="logout-btn" onClick={handleLogout}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                <section className="dashboard-content">
                    {sectionComponents[activeSection]}
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout;