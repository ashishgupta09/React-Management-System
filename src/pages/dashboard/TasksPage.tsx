import PermissionGuard from "../../components/PermissionGuard";

function TasksPage() {
  return (
    <div>
      <h2>Tasks</h2>
      <p>Todo / task management module.</p>

      <PermissionGuard permission="manage_tasks">
        <button>Add Task</button>
      </PermissionGuard>

      <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
        <PermissionGuard permission="manage_tasks">
          <button>Edit Task</button>
        </PermissionGuard>

        <PermissionGuard permission="manage_tasks">
          <button>Delete Task</button>
        </PermissionGuard>
      </div>
    </div>
  );
}

export default TasksPage;