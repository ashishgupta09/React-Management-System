import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateUser } from "../services/userService";
import type { UserData, UserFormData } from "../interfaces/user.interface";
import { initialFormData } from "../constants/user.constants";
import "../styles/profileDrawer.css";

interface ProfileDrawerProps {
    user: UserData | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedUser: UserData) => void;
}

export default function ProfileDrawer({
    user,
    isOpen,
    onClose,
    onUpdate,
}: ProfileDrawerProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const { _id, ...rest } = user;
            setFormData(rest as UserFormData);
        }
    }, [user, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const keys = name.split(".");
            setFormData((prev) => {
                const updated = structuredClone(prev) as unknown as Record<
                    string,
                    unknown
                >;
                let current = updated;
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) {
                        current[keys[i]] = {};
                    }
                    current = current[keys[i]] as Record<string, unknown>;
                }
                current[keys[keys.length - 1]] = value;
                return updated as unknown as UserFormData;
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const updatedUserData = await updateUser(user._id, formData);
            toast.success("Profile updated successfully");
            setIsEditMode(false);
            onUpdate(updatedUserData);
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="profile-drawer-overlay"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div className={`profile-drawer ${isOpen ? "open" : ""}`}>
                {/* Header */}
                <div className="profile-drawer-header">
                    <h2>{isEditMode ? "Edit Profile" : "User Profile"}</h2>
                    <button
                        className="profile-drawer-close"
                        onClick={onClose}
                        aria-label="Close drawer"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="profile-drawer-content">
                    {/* Profile Avatar & Basic Info */}
                    <div className="profile-header-section">
                        <img
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="profile-avatar-large"
                        />
                        <div className="profile-basic-info">
                            <h3>
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="profile-role">{user.role}</p>
                            <p className="profile-email">{user.email}</p>
                        </div>
                    </div>

                    {/* Edit/View Toggle */}
                    <div className="profile-mode-toggle">
                        {!isEditMode ? (
                            <button
                                className="primary-btn"
                                onClick={() => setIsEditMode(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="profile-mode-buttons">
                                <button
                                    className="primary-btn"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    className="secondary-btn"
                                    onClick={() => {
                                        setIsEditMode(false);
                                        const { _id, ...rest } = user;
                                        setFormData(rest as UserFormData);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Form Sections */}
                    <form className="profile-form">
                        {/* Personal Information */}
                        <div className="profile-section">
                            <h4 className="profile-section-title">
                                Personal Information
                            </h4>
                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={!isEditMode}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.firstName}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.lastName}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    {isEditMode ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.email}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    {isEditMode ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.phone}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Username</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.username}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Gender</label>
                                    {isEditMode ? (
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    ) : (
                                        <div className="form-display">
                                            {formData.gender || "N/A"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="profile-section">
                            <h4 className="profile-section-title">
                                Profile Details
                            </h4>
                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label>Age</label>
                                    {isEditMode ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.age || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Birth Date</label>
                                    {isEditMode ? (
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.birthDate || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Blood Group</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.bloodGroup || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Height (cm)</label>
                                    {isEditMode ? (
                                        <input
                                            type="number"
                                            name="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.height || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Weight (kg)</label>
                                    {isEditMode ? (
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.weight || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Role</label>
                                    {isEditMode ? (
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="moderator">
                                                Moderator
                                            </option>
                                        </select>
                                    ) : (
                                        <div className="form-display">
                                            {formData.role || "N/A"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="profile-section">
                            <h4 className="profile-section-title">
                                Company Information
                            </h4>
                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label>Company</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="company.name"
                                            value={formData.company?.name || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.company?.name || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Department</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="company.department"
                                            value={formData.company?.department || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.company?.department || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Title</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="company.title"
                                            value={formData.company?.title || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.company?.title || "N/A"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="profile-section">
                            <h4 className="profile-section-title">
                                Address Information
                            </h4>
                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label>Street</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="address.address"
                                            value={formData.address?.address || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.address?.address || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>City</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={formData.address?.city || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.address?.city || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>State</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={formData.address?.state || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.address?.state || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Postal Code</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="address.postalCode"
                                            value={formData.address?.postalCode || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.address?.postalCode || "N/A"}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Country</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            name="address.country"
                                            value={formData.address?.country || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <div className="form-display">
                                            {formData.address?.country || "N/A"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
