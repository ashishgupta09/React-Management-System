import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    addUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser,
} from "../../services/userService";
import type { UserData, UserFormData } from "../../interfaces/user.interface";
import { initialFormData, sampleUserData } from "../../constants/user.constants";
import ProfileDrawer from "../../components/ProfileDrawer";
import { SkeletonTable } from "../../components/Skeleton";
import { Eye, Pencil, Trash2 } from "lucide-react";
import "../../styles/users.css";

function Users() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
    const [selectedUserForProfile, setSelectedUserForProfile] = useState<UserData | null>(null);
    const usersPerPage = 10;

    const filteredUsers = users.filter((user) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
            fullName.includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term) ||
            user.role.toLowerCase().includes(term) ||
            user.phone.toLowerCase().includes(term)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, users.length]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditId(null);
        setFormData(structuredClone(initialFormData));
        setModalOpen(true);
    };

    const fillSampleData = () => {
        setFormData(structuredClone(sampleUserData));
    };

    const openEditModal = async (id: string) => {
        try {
            setLoading(true);
            const user = await getUserById(id);
            const { _id, ...rest } = user;
            setEditId(id);
            setFormData(rest);
            setModalOpen(true);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to fetch user");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditId(null);
        setFormData(structuredClone(initialFormData));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const keys = name.split(".");

            setFormData((prev) => {
                const updated = structuredClone(prev) as unknown as Record<string, unknown>;
                let current: Record<string, unknown> = updated;

                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]] as Record<string, unknown>;
                }

                const lastKey = keys[keys.length - 1];
                current[lastKey] =
                    name === "age" ||
                        name === "height" ||
                        name === "weight" ||
                        name.endsWith(".lat") ||
                        name.endsWith(".lng")
                        ? Number(value)
                        : value;

                return updated as unknown as UserFormData;
            });

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "age" || name === "height" || name === "weight"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (editId !== null) {
                await updateUser(editId, formData);
                toast.success("User updated successfully");
            } else {
                await addUser(formData);
                toast.success("User added successfully");
            }

            closeModal();
            await loadUsers();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await deleteUser(id);
            toast.success("User deleted successfully");
            await loadUsers();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    const openProfileDrawer = (user: UserData) => {
        setSelectedUserForProfile(user);
        setProfileDrawerOpen(true);
    };

    const closeProfileDrawer = () => {
        setProfileDrawerOpen(false);
        setSelectedUserForProfile(null);
    };

    const handleProfileUpdate = (updatedUser: UserData) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === updatedUser._id ? updatedUser : user
            )
        );
        setSelectedUserForProfile(updatedUser);
        toast.success("Profile updated successfully");
    };

    return (
        <div className="users-page">
            <div className="users-topbar">
                <div>
                    <h1>User Management</h1>
                    <p>Complete CRUD with modal form</p>
                </div>

                <div className="topbar-actions">
                    <input
                        className="users-search-input"
                        type="text"
                        placeholder="Search by name, email, username, role, phone"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="primary-btn" onClick={openAddModal}>
                        Add User
                    </button>
                </div>
            </div>

            <div className="users-table-card">
                {loading ? (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Gender</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <SkeletonTable rows={8} columns={9} />
                        </tbody>
                    </table>
                ) : (
                    <div className="users-table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Gender</th>
                                    <th>Role</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                            <td>
                                                <img
                                                    src={user.image}
                                                    alt={user.firstName}
                                                    className="user-avatar"
                                                    onClick={() => openProfileDrawer(user)}
                                                    style={{ cursor: "pointer" }}
                                                    title="Click to view profile"
                                                />
                                            </td>
                                            <td>{`${user.firstName} ${user.lastName}`}</td>
                                            <td>{user.email}</td>
                                            <td>{user.username}</td>
                                            <td>{user.gender}</td>
                                            <td>{user.role}</td>
                                            <td>{user.phone}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="icon-btn view-btn"
                                                        onClick={() => openProfileDrawer(user)}
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="icon-btn edit-btn"
                                                        onClick={() => openEditModal(user._id)}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        className="icon-btn delete-btn"
                                                        onClick={() => handleDelete(user._id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="empty-text">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="pagination-row">
                            <div className="pagination-info">
                                Showing {(currentPage - 1) * usersPerPage + 1} - {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length}
                            </div>
                            <div className="pagination-actions">
                                <button
                                    className="secondary-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="secondary-btn"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="user-modal">
                        <div className="modal-header">
                            <h2>{editId !== null ? "Edit User" : "Add User"}</h2>
                            <button className="close-btn" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <form className="user-form" onSubmit={handleSubmit}>
                            <div className="form-top-actions">
                                {editId === null && (
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={fillSampleData}
                                    >
                                        Fill Sample Data
                                    </button>
                                )}
                            </div>

                            <div className="form-grid">
                                <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                                <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                                <input name="maidenName" placeholder="Maiden Name" value={formData.maidenName} onChange={handleChange} />
                                <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} />
                                <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} />
                                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                                <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                                <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                                <input name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                                <input name="birthDate" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange} />
                                <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
                                <input name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleChange} />
                                <input name="height" type="number" placeholder="Height" value={formData.height} onChange={handleChange} />
                                <input name="weight" type="number" placeholder="Weight" value={formData.weight} onChange={handleChange} />
                                <input name="eyeColor" placeholder="Eye Color" value={formData.eyeColor} onChange={handleChange} />
                                <input name="hair.color" placeholder="Hair Color" value={formData.hair.color} onChange={handleChange} />
                                <input name="hair.type" placeholder="Hair Type" value={formData.hair.type} onChange={handleChange} />
                                <input name="ip" placeholder="IP" value={formData.ip} onChange={handleChange} />
                                <input name="address.address" placeholder="Address" value={formData.address.address} onChange={handleChange} />
                                <input name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} />
                                <input name="address.state" placeholder="State" value={formData.address.state} onChange={handleChange} />
                                <input name="address.stateCode" placeholder="State Code" value={formData.address.stateCode} onChange={handleChange} />
                                <input name="address.postalCode" placeholder="Postal Code" value={formData.address.postalCode} onChange={handleChange} />
                                <input name="address.coordinates.lat" type="number" placeholder="Latitude" value={formData.address.coordinates.lat} onChange={handleChange} />
                                <input name="address.coordinates.lng" type="number" placeholder="Longitude" value={formData.address.coordinates.lng} onChange={handleChange} />
                                <input name="address.country" placeholder="Country" value={formData.address.country} onChange={handleChange} />
                                <input name="macAddress" placeholder="MAC Address" value={formData.macAddress} onChange={handleChange} />
                                <input name="university" placeholder="University" value={formData.university} onChange={handleChange} />
                                <input name="bank.cardExpire" placeholder="Card Expire" value={formData.bank.cardExpire} onChange={handleChange} />
                                <input name="bank.cardNumber" placeholder="Card Number" value={formData.bank.cardNumber} onChange={handleChange} />
                                <input name="bank.cardType" placeholder="Card Type" value={formData.bank.cardType} onChange={handleChange} />
                                <input name="bank.currency" placeholder="Currency" value={formData.bank.currency} onChange={handleChange} />
                                <input name="bank.iban" placeholder="IBAN" value={formData.bank.iban} onChange={handleChange} />
                                <input name="company.department" placeholder="Department" value={formData.company.department} onChange={handleChange} />
                                <input name="company.name" placeholder="Company Name" value={formData.company.name} onChange={handleChange} />
                                <input name="company.title" placeholder="Company Title" value={formData.company.title} onChange={handleChange} />
                                <input name="company.address.address" placeholder="Company Address" value={formData.company.address.address} onChange={handleChange} />
                                <input name="company.address.city" placeholder="Company City" value={formData.company.address.city} onChange={handleChange} />
                                <input name="company.address.state" placeholder="Company State" value={formData.company.address.state} onChange={handleChange} />
                                <input name="company.address.stateCode" placeholder="Company State Code" value={formData.company.address.stateCode} onChange={handleChange} />
                                <input name="company.address.postalCode" placeholder="Company Postal Code" value={formData.company.address.postalCode} onChange={handleChange} />
                                <input name="company.address.coordinates.lat" type="number" placeholder="Company Lat" value={formData.company.address.coordinates.lat} onChange={handleChange} />
                                <input name="company.address.coordinates.lng" type="number" placeholder="Company Lng" value={formData.company.address.coordinates.lng} onChange={handleChange} />
                                <input name="company.address.country" placeholder="Company Country" value={formData.company.address.country} onChange={handleChange} />
                                <input name="ein" placeholder="EIN" value={formData.ein} onChange={handleChange} />
                                <input name="ssn" placeholder="SSN" value={formData.ssn} onChange={handleChange} />
                                <input name="userAgent" placeholder="User Agent" value={formData.userAgent} onChange={handleChange} />
                                <input name="crypto.coin" placeholder="Crypto Coin" value={formData.crypto.coin} onChange={handleChange} />
                                <input name="crypto.wallet" placeholder="Crypto Wallet" value={formData.crypto.wallet} onChange={handleChange} />
                                <input name="crypto.network" placeholder="Crypto Network" value={formData.crypto.network} onChange={handleChange} />
                                <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="secondary-btn" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn">
                                    {editId !== null ? "Update User" : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Profile Drawer */}
            <ProfileDrawer
                user={selectedUserForProfile}
                isOpen={profileDrawerOpen}
                onClose={closeProfileDrawer}
                onUpdate={handleProfileUpdate}
            />
        </div>
    );
}

export default Users;