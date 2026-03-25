import { useState } from "react";
import type { Permission, UserRole } from "../../interfaces/auth.interface";
import "../../styles/roles.css";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

const allPermissions: Permission[] = [
  "view_overview",
  "view_users",
  "manage_users",
  "view_reports",
  "view_tasks",
  "manage_tasks",
  "manage_settings",
];

const getPermissionsByRole = (role: UserRole): Permission[] => {
  switch (role) {
    case "ADMIN":
      return [...allPermissions];
    case "MANAGER":
      return [
        "view_overview",
        "view_users",
        "manage_users",
        "view_reports",
        "view_tasks",
        "manage_tasks",
      ];
    case "USER":
    default:
      return [
        "view_overview",
        "view_users",
        "manage_users",
        "view_reports",
        "view_tasks",
        "manage_tasks",
      ];
  }
};

const initialUsers: ManagedUser[] = [
  {
    id: "1",
    name: "Test Admin",
    email: "admin@example.com",
    role: "ADMIN",
    permissions: [...allPermissions],
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@example.com",
    role: "MANAGER",
    permissions: getPermissionsByRole("MANAGER"),
  },
  {
    id: "3",
    name: "Normal User",
    email: "user@example.com",
    role: "USER",
    permissions: getPermissionsByRole("USER"),
  },
];

function RolesPermissionsPage() {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);

  const handleRoleChange = (userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
            ...user,
            role,
            permissions: getPermissionsByRole(role),
          }
          : user
      )
    );
  };

  const handlePermissionToggle = (userId: string, permission: Permission) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;

        const hasPermission = user.permissions.includes(permission);

        return {
          ...user,
          permissions: hasPermission
            ? user.permissions.filter((item) => item !== permission)
            : [...user.permissions, permission],
        };
      })
    );
  };

  return (
    <div className="roles-page">
      <div className="roles-header">
        <h1>Roles & Permissions</h1>
        <p>Admin can change user role and component access here.</p>
      </div>

      <div className="roles-grid">
        {users.map((user) => (
          <div key={user.id} className="roles-card">
            <div className="roles-card-header">
              <div className="roles-card-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>

              <div className="roles-select-wrapper">
                <label>Role:</label>
                <select
                  className="roles-select"
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value as UserRole)
                  }
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="USER">USER</option>
                </select>
              </div>
            </div>

            <div>
              <p className="permissions-section-title">Permissions</p>
              <div className="permissions-grid">
                {allPermissions.map((permission) => (
                  <label key={permission} className="permission-label">
                    <input
                      type="checkbox"
                      checked={user.permissions.includes(permission)}
                      onChange={() =>
                        handlePermissionToggle(user.id, permission)
                      }
                    />
                    <span>{permission}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RolesPermissionsPage;