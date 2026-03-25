import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
    bulkDeleteTodos,
    bulkUpdateTodoStatus,
    createTodo,
    deleteTodo,
    getTodosByUserId,
    updateTodo,
} from "../../services/todoService";
import { getUsers } from "../../services/userService";
import type { UserData } from "../../interfaces/user.interface";
import type { Todo, TodoPriority } from "../../interfaces/todo.interface";
import { SkeletonStatCard, SkeletonTable } from "../../components/Skeleton";
import { CheckCircle, Circle, Pencil, Trash2 } from "lucide-react";
import "../../styles/todo.css";

type TodoFormData = {
    todo: string;
    priority: TodoPriority;
    completed: boolean;
};

const initialFormData: TodoFormData = {
    todo: "",
    priority: "medium",
    completed: false,
};

function TodoList() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [formData, setFormData] = useState<TodoFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<"" | TodoPriority>("");
    const [completedFilter, setCompletedFilter] = useState<"" | "true" | "false">("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            loadTodos(selectedUserId);
        } else {
            setTodos([]);
            setTotalPages(1);
            setSelectedIds([]);
        }
    }, [selectedUserId, page, priorityFilter, completedFilter, search]);

    const loadUsers = async () => {
        try {
            setUsersLoading(true);
            const data = await getUsers();
            setUsers(data);

            if (data.length > 0) {
                setSelectedUserId(data[0]._id);
            }
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to load users");
        } finally {
            setUsersLoading(false);
        }
    };

    const loadTodos = async (userId: string) => {
        try {
            setLoading(true);

            const result = await getTodosByUserId({
                userId,
                page,
                limit,
                sortBy: "createdAt",
                order: "desc",
                priority: priorityFilter,
                completed:
                    completedFilter === ""
                        ? ""
                        : completedFilter === "true",
                search,
            });

            setTodos(result.todos);
            setTotalPages(result.pages);
            setSelectedIds([]);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to load todos");
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        if (!selectedUserId) {
            toast.error("Please select a user first");
            return;
        }

        setEditId(null);
        setFormData(initialFormData);
        setModalOpen(true);
    };

    const openEditModal = (todo: Todo) => {
        setEditId(todo._id);
        setFormData({
            todo: todo.todo,
            priority: todo.priority,
            completed: todo.completed,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setEditId(null);
        setFormData(initialFormData);
        setModalOpen(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedUserId) {
            toast.error("Please select a user");
            return;
        }

        if (!formData.todo.trim()) {
            toast.error("Please enter todo text");
            return;
        }

        try {
            setLoading(true);

            if (editId) {
                await updateTodo(editId, {
                    todo: formData.todo,
                    priority: formData.priority,
                    completed: formData.completed,
                });
                toast.success("Todo updated successfully");
            } else {
                await createTodo({
                    userId: selectedUserId,
                    todo: formData.todo,
                    priority: formData.priority,
                    completed: formData.completed,
                });
                toast.success("Todo created successfully");
            }

            closeModal();
            await loadTodos(selectedUserId);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
        if (!confirmDelete || !selectedUserId) return;

        try {
            setLoading(true);
            await deleteTodo(id);
            toast.success("Todo deleted successfully");
            await loadTodos(selectedUserId);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to delete todo");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCompleted = async (todo: Todo) => {
        if (!selectedUserId) return;

        try {
            setLoading(true);
            await updateTodo(todo._id, {
                completed: !todo.completed,
            });
            toast.success("Todo status updated");
            await loadTodos(selectedUserId);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTodo = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === todos.length) {
            setSelectedIds([]);
            return;
        }

        setSelectedIds(todos.map((todo) => todo._id));
    };

    const handleBulkComplete = async (completed: boolean) => {
        if (!selectedUserId) {
            toast.error("Please select a user");
            return;
        }

        if (selectedIds.length === 0) {
            toast.error("Please select at least one todo");
            return;
        }

        try {
            setLoading(true);

            await bulkUpdateTodoStatus({
                ids: selectedIds,
                updates: {
                    completed,
                },
            });

            toast.success("Bulk status updated successfully");
            await loadTodos(selectedUserId);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Bulk update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedUserId) {
            toast.error("Please select a user");
            return;
        }

        if (selectedIds.length === 0) {
            toast.error("Please select at least one todo");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete selected todos?");
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await bulkDeleteTodos({ ids: selectedIds });
            toast.success("Selected todos deleted successfully");
            await loadTodos(selectedUserId);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Bulk delete failed");
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const completedCount = todos.filter((item) => item.completed).length;
        const pendingCount = todos.filter((item) => !item.completed).length;
        const highPriorityCount = todos.filter((item) => item.priority === "high").length;

        return {
            total: todos.length,
            completed: completedCount,
            pending: pendingCount,
            highPriority: highPriorityCount,
        };
    }, [todos]);

    return (
        <div className="todo-page">
            <div className="todo-header">
                <div>
                    <h1>Todo List</h1>
                    <p>Manage user-based todo items using selected user _id</p>
                </div>

                <button className="primary-btn" onClick={openAddModal}>
                    Add Todo
                </button>
            </div>

            <div className="todo-user-select-card">
                <label>Select User</label>
                <select
                    className="todo-user-select"
                    value={selectedUserId}
                    onChange={(e) => {
                        setPage(1);
                        setSelectedUserId(e.target.value);
                    }}
                    disabled={usersLoading}
                >
                    <option value="">Select user</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="todo-filters">
                <input
                    type="text"
                    placeholder="Search todo"
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    disabled={!selectedUserId}
                />

                <select
                    value={priorityFilter}
                    onChange={(e) => {
                        setPage(1);
                        setPriorityFilter(e.target.value as "" | TodoPriority);
                    }}
                    disabled={!selectedUserId}
                >
                    <option value="">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <select
                    value={completedFilter}
                    onChange={(e) => {
                        setPage(1);
                        setCompletedFilter(e.target.value as "" | "true" | "false");
                    }}
                    disabled={!selectedUserId}
                >
                    <option value="">All Status</option>
                    <option value="true">Completed</option>
                    <option value="false">Pending</option>
                </select>
            </div>

            <div className="todo-stats">
                {!selectedUserId ? (
                    <>
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                    </>
                ) : loading ? (
                    <>
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                    </>
                ) : (
                    <>
                        <div className="todo-stat-card">
                            <h3>Total</h3>
                            <p>{stats.total}</p>
                        </div>
                        <div className="todo-stat-card">
                            <h3>Completed</h3>
                            <p>{stats.completed}</p>
                        </div>
                        <div className="todo-stat-card">
                            <h3>Pending</h3>
                            <p>{stats.pending}</p>
                        </div>
                        <div className="todo-stat-card">
                            <h3>High Priority</h3>
                            <p>{stats.highPriority}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="todo-bulk-actions">
                <button className="secondary-btn" onClick={() => handleBulkComplete(true)}>
                    <CheckCircle size={18} />
                    <span>Mark Selected Completed</span>
                </button>
                <button className="secondary-btn" onClick={() => handleBulkComplete(false)}>
                    <Circle size={18} />
                    <span>Mark Selected Pending</span>
                </button>
                <button className="delete-btn" onClick={handleBulkDelete}>
                    <Trash2 size={18} />
                    <span>Delete Selected</span>
                </button>
            </div>

            <div className="todo-table-card">
                {!selectedUserId ? (
                    <p>Please select a user to view todos.</p>
                ) : loading ? (
                    <table className="todo-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" disabled />
                                </th>
                                <th>Todo</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <SkeletonTable rows={8} columns={6} />
                        </tbody>
                    </table>
                ) : (
                    <div className="todo-table-wrapper">
                        <table className="todo-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={todos.length > 0 && selectedIds.length === todos.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Todo</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {todos.length > 0 ? (
                                    todos.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(item._id)}
                                                    onChange={() => handleSelectTodo(item._id)}
                                                />
                                            </td>
                                            <td>{item.todo}</td>
                                            <td>
                                                <span className={`badge priority-${item.priority}`}>
                                                    {item.priority}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${item.completed ? "status-completed" : "status-pending"
                                                        }`}
                                                >
                                                    {item.completed ? "Completed" : "Pending"}
                                                </span>
                                            </td>
                                            <td>
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className={`icon-btn toggle-btn ${item.completed ? 'completed' : 'pending'}`}
                                                        onClick={() => handleToggleCompleted(item)}
                                                        title={item.completed ? "Mark Pending" : "Mark Completed"}
                                                    >
                                                        {item.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                                                    </button>
                                                    <button
                                                        className="icon-btn edit-btn"
                                                        onClick={() => openEditModal(item)}
                                                        title="Edit Task"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        className="icon-btn delete-btn"
                                                        onClick={() => handleDelete(item._id)}
                                                        title="Delete Task"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="empty-text">
                                            No todos found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="pagination">
                <button
                    className="secondary-btn"
                    disabled={page === 1 || !selectedUserId}
                    onClick={() => setPage((prev) => prev - 1)}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    className="secondary-btn"
                    disabled={page === totalPages || !selectedUserId}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="todo-modal">
                        <div className="modal-header">
                            <h2>{editId ? "Edit Todo" : "Add Todo"}</h2>
                            <button className="close-btn" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <form className="todo-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Todo</label>
                                <input
                                    type="text"
                                    name="todo"
                                    value={formData.todo}
                                    onChange={handleChange}
                                    placeholder="Enter todo"
                                />
                            </div>

                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="completed"
                                        checked={formData.completed}
                                        onChange={handleChange}
                                    />
                                    Completed
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn">
                                    {editId ? "Update Todo" : "Add Todo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodoList;