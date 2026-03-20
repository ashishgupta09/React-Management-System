import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Users from "./Users";
import Reports from "./Reports";
import Settings from "./Settings";
import { Menu, LogOut } from "lucide-react";
import "../../styles/dashboard.css";

type SectionType = "overview" | "users" | "reports" | "settings";

function DashboardLayout() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<SectionType>("overview");
    const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

    const sectionComponents: Record<SectionType, JSX.Element> = {
        overview: <Overview />,
        users: <Users />,
        reports: <Reports />,
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

                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </header>

                <section className="dashboard-content">
                    {sectionComponents[activeSection]}
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout;