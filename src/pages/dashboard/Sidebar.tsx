import React from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileBarChart2,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
    CheckSquare,
    ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type SectionType = "overview" | "users" | "reports" | "tasks" | "settings" | "roles";

interface SidebarProps {
    activeSection: SectionType;
    setActiveSection: (section: SectionType) => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({
    activeSection,
    setActiveSection,
    isOpen,
    setIsOpen,
}: SidebarProps) {
    const navigate = useNavigate();
    const { hasPermission, hasRole } = useAuth();

    const menuItems = [
        hasPermission("view_overview") && {
            key: "overview" as SectionType,
            label: "Overview",
            icon: <LayoutDashboard size={20} />,
        },
        hasPermission("view_users") && {
            key: "users" as SectionType,
            label: "Users",
            icon: <Users size={20} />,
        },
        hasPermission("view_reports") && {
            key: "reports" as SectionType,
            label: "Reports",
            icon: <FileBarChart2 size={20} />,
        },
        hasPermission("view_tasks") && {
            key: "tasks" as SectionType,
            label: "Tasks",
            icon: <CheckSquare size={20} />,
        },
        hasPermission("manage_settings") && {
            key: "settings" as SectionType,
            label: "Settings",
            icon: <Settings size={20} />,
        },
        hasRole("ADMIN") && {
            key: "roles" as SectionType,
            label: "Roles & Access",
            icon: <ShieldCheck size={20} />,
        },
    ].filter(Boolean) as {
        key: SectionType;
        label: string;
        icon: React.ReactNode;
    }[];

    const handleMenuClick = (section: SectionType) => {
        setActiveSection(section);
        navigate(`/home/${section}`);

        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
    };

    return (
        <div className="sidebar-inner">
            <div className="sidebar-header">
                {isOpen && <h2>AdminSphere</h2>}

                <button
                    type="button"
                    className="sidebar-toggle-btn"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                </button>
            </div>

            <ul className="menu-list">
                {menuItems.map((item) => (
                    <li
                        key={item.key}
                        className={activeSection === item.key ? "active" : ""}
                        onClick={() => handleMenuClick(item.key)}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        {isOpen && <span className="menu-label">{item.label}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;