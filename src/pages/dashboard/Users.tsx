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
import "../../styles/users.css";

const initialFormData: UserFormData = {
    firstName: "",
    lastName: "",
    maidenName: "",
    age: 0,
    gender: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    birthDate: "",
    image: "",
    bloodGroup: "",
    height: 0,
    weight: 0,
    eyeColor: "",
    hair: {
        color: "",
        type: "",
    },
    ip: "",
    address: {
        address: "",
        city: "",
        state: "",
        stateCode: "",
        postalCode: "",
        coordinates: {
            lat: 0,
            lng: 0,
        },
        country: "",
    },
    macAddress: "",
    university: "",
    bank: {
        cardExpire: "",
        cardNumber: "",
        cardType: "",
        currency: "",
        iban: "",
    },
    company: {
        department: "",
        name: "",
        title: "",
        address: {
            address: "",
            city: "",
            state: "",
            stateCode: "",
            postalCode: "",
            coordinates: {
                lat: 0,
                lng: 0,
            },
            country: "",
        },
    },
    ein: "",
    ssn: "",
    userAgent: "",
    crypto: {
        coin: "",
        wallet: "",
        network: "",
    },
    role: "",
};

function Users() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState<UserFormData>(initialFormData);

    useEffect(() => {
        loadUsers();
    }, []);

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
        setFormData(initialFormData);
        setModalOpen(true);
    };

    const openEditModal = async (id: number) => {
        try {
            setLoading(true);
            const user = await getUserById(id);
            const { id: _, ...rest } = user;
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
        setFormData(initialFormData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const keys = name.split(".");

            setFormData((prev) => {
                const updated = structuredClone(prev) as Record<string, unknown>;
                let current: Record<string, unknown> = updated;

                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]] as Record<string, unknown>;
                }

                const lastKey = keys[keys.length - 1];
                current[lastKey] =
                    name.includes("age") ||
                        name.includes("height") ||
                        name.includes("weight") ||
                        name.includes("lat") ||
                        name.includes("lng")
                        ? Number(value)
                        : value;

                return updated as UserFormData;
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

    const handleDelete = async (id: number) => {
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

    return (
        <div className="users-page">
            <div className="users-topbar">
                <div>
                    <h1>User Management</h1>
                    <p>Complete CRUD with modal form</p>
                </div>

                <button className="primary-btn" onClick={openAddModal}>
                    Add User
                </button>
            </div>

            <div className="users-table-card">
                {loading ? (
                    <p>Loading...</p>
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
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>
                                                <img
                                                    src={user.image}
                                                    alt={user.firstName}
                                                    className="user-avatar"
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
                                                        className="edit-btn"
                                                        onClick={() => openEditModal(user.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        Delete
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
        </div>
    );
}

export default Users;