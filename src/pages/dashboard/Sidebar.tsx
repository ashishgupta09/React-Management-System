import React from "react";
import {
    LayoutDashboard,
    Users,
    FileBarChart2,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

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
                key: "settings",
                label: "Settings",
                icon: <Settings size={20} />,
            },
            {
                key: "tasks",
                label: "Tasks",
                icon: <LayoutDashboard size={20} />,
            },
        ];

    const handleMenuClick = (section: SectionType) => {
        setActiveSection(section);

        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
    };

    return (
        <div className="sidebar-inner">
            <div className="sidebar-header">
                {isOpen && <h2>My Panel</h2>}

                <button className="sidebar-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
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
    )
}

export default Sidebar;