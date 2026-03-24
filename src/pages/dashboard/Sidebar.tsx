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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type SectionType = "overview" | "users" | "reports" | "tasks" | "settings";

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
    const { logout } = useAuth();

    const menuItems: {
        key: SectionType;
        label: string;
        icon: React.ReactNode;
    }[] = [
            {
                key: "overview",
                label: "Overview",
                icon: <LayoutDashboard size={20} />,
            },
            {
                key: "users",
                label: "Users",
                icon: <Users size={20} />,
            },
            {
                key: "reports",
                label: "Reports",
                icon: <FileBarChart2 size={20} />,
            },
            {
                key: "tasks",
                label: "Tasks",
                icon: <CheckSquare size={20} />,
            },
            {
                key: "settings",
                label: "Settings",
                icon: <Settings size={20} />,
            },
        ];

    const handleMenuClick = (section: SectionType) => {
        setActiveSection(section);
        navigate(`/home/${section}`);

        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
    };

    // const handleLogout = () => {
    //     logout();
    //     navigate("/login", { replace: true });
    // };

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
            {/* 
            <div className="sidebar-footer">
                <button type="button" className="logout-btn" onClick={handleLogout}>
                    {isOpen ? "Logout" : "⎋"}
                </button>
            </div> */}
        </div>
    );
}

export default Sidebar;