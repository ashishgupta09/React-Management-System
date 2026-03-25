import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { JSX } from "react";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Users from "./Users";
import Reports from "./Reports";
import Settings from "./Settings";
import TodoList from "./TodoList";
import RolesPermissionsPage from "./RolesPermissionsPage";
import { Menu, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import PermissionGuard from "../../components/PermissionGuard";
import "../../styles/dashboard.css";

type SectionType =
  | "overview"
  | "users"
  | "reports"
  | "tasks"
  | "settings"
  | "roles";

function DashboardLayout() {
  const navigate = useNavigate();
  const { section } = useParams();
  const { theme, toggleTheme } = useTheme();
  const { logout, hasPermission, hasRole } = useAuth();

  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [activeSection, setActiveSection] = useState<SectionType>("overview");

  const allowedSections = useMemo(() => {
    const sections: SectionType[] = [];

    if (hasPermission("view_overview")) sections.push("overview");
    if (hasPermission("view_users")) sections.push("users");
    if (hasPermission("view_reports")) sections.push("reports");
    if (hasPermission("view_tasks")) sections.push("tasks");
    if (hasPermission("manage_settings")) sections.push("settings");
    if (hasRole("ADMIN")) sections.push("roles");

    return sections;
  }, [hasPermission, hasRole]);

  useEffect(() => {
    if (!section) {
      if (allowedSections.length > 0) {
        setActiveSection(allowedSections[0]);
        navigate(`/home/${allowedSections[0]}`, { replace: true });
      }
      return;
    }

    const routeSection = section as SectionType;

    if (allowedSections.includes(routeSection)) {
      setActiveSection(routeSection);
    } else if (allowedSections.length > 0) {
      setActiveSection(allowedSections[0]);
      navigate(`/home/${allowedSections[0]}`, { replace: true });
    }
  }, [section, allowedSections, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sectionComponents: Record<SectionType, JSX.Element> = {
    overview: (
      <PermissionGuard permission="view_overview">
        <Overview />
      </PermissionGuard>
    ),
    users: (
      <PermissionGuard permission="view_users">
        <Users />
      </PermissionGuard>
    ),
    reports: (
      <PermissionGuard permission="view_reports">
        <Reports />
      </PermissionGuard>
    ),
    tasks: (
      <PermissionGuard permission="view_tasks">
        <TodoList />
      </PermissionGuard>
    ),
    settings: (
      <PermissionGuard permission="manage_settings">
        <Settings />
      </PermissionGuard>
    ),
    roles: hasRole("ADMIN") ? <RolesPermissionsPage /> : <Overview />,
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
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
              type="button"
            >
              <Menu size={20} />
            </button>
            <h2 className="header-title">Management Dashboard</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              type="button"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button className="logout-btn" onClick={handleLogout} type="button">
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
  );
}

export default DashboardLayout;