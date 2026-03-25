import { useState } from "react";
import type { Permission, UserRole } from "../../interfaces/auth.interface";

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
    <div>
      <h2>Roles & Permissions</h2>
      <p>Admin can change user role and component access here.</p>

      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
              background: "#fff",
            }}
          >
            <h3 style={{ marginBottom: "6px" }}>{user.name}</h3>
            <p style={{ marginBottom: "12px", color: "#64748b" }}>{user.email}</p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ marginRight: "10px" }}>Role:</label>
              <select
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

            <div>
              <p style={{ marginBottom: "10px", fontWeight: 600 }}>
                Permissions
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "10px",
                }}
              >
                {allPermissions.map((permission) => (
                  <label
                    key={permission}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  >
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