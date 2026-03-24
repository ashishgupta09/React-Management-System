import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserById, updateUser } from "../../services/userService";
import type { UserData, UserFormData } from "../../interfaces/user.interface";
import { SkeletonFormSection } from "../../components/Skeleton";
import "../../styles/settings.css";

type FieldConfig = {
    label: string;
    name: string;
    type: "text" | "email" | "number" | "date" | "password";
};

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

const profileFields: FieldConfig[] = [
    { label: "First Name", name: "firstName", type: "text" },
    { label: "Last Name", name: "lastName", type: "text" },
    { label: "Username", name: "username", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Profile Image URL", name: "image", type: "text" },
];

const personalFields: FieldConfig[] = [
    { label: "Maiden Name", name: "maidenName", type: "text" },
    { label: "Age", name: "age", type: "number" },
    { label: "Gender", name: "gender", type: "text" },
    { label: "Birth Date", name: "birthDate", type: "date" },
    { label: "Blood Group", name: "bloodGroup", type: "text" },
    { label: "Height", name: "height", type: "number" },
    { label: "Weight", name: "weight", type: "number" },
    { label: "Eye Color", name: "eyeColor", type: "text" },
    { label: "Hair Color", name: "hair.color", type: "text" },
    { label: "Hair Type", name: "hair.type", type: "text" },
];

const addressFields: FieldConfig[] = [
    { label: "Address", name: "address.address", type: "text" },
    { label: "City", name: "address.city", type: "text" },
    { label: "State", name: "address.state", type: "text" },
    { label: "State Code", name: "address.stateCode", type: "text" },
    { label: "Postal Code", name: "address.postalCode", type: "text" },
    { label: "Country", name: "address.country", type: "text" },
    { label: "Latitude", name: "address.coordinates.lat", type: "number" },
    { label: "Longitude", name: "address.coordinates.lng", type: "number" },
];

const professionalFields: FieldConfig[] = [
    { label: "University", name: "university", type: "text" },
    { label: "Company Name", name: "company.name", type: "text" },
    { label: "Department", name: "company.department", type: "text" },
    { label: "Job Title", name: "company.title", type: "text" },
];

const numericFields = new Set([
    "age",
    "height",
    "weight",
    "address.coordinates.lat",
    "address.coordinates.lng",
    "company.address.coordinates.lat",
    "company.address.coordinates.lng",
]);

const getValue = (obj: UserFormData, path: string): string | number => {
    const value = path.split(".").reduce<unknown>((acc, key) => {
        if (acc && typeof acc === "object" && key in acc) {
            return (acc as Record<string, unknown>)[key];
        }
        return "";
    }, obj);

    return typeof value === "string" || typeof value === "number" ? value : "";
};

const setNestedValue = (
    obj: UserFormData,
    path: string,
    value: string | number
): UserFormData => {
    const keys = path.split(".");
    const updated: UserFormData = structuredClone(obj);
    let current: unknown = updated;

    for (let i = 0; i < keys.length - 1; i++) {
        if (current && typeof current === "object") {
            current = (current as Record<string, unknown>)[keys[i]];
        }
    }

    if (current && typeof current === "object") {
        (current as Record<string, unknown>)[keys[keys.length - 1]] = value;
    }

    return updated;
};

function Settings() {
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [loading, setLoading] = useState(false);

    const userId = ""; // Replace with actual user ID logic

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const user: UserData = await getUserById(userId);
            const { _id: _, ...rest } = user;
            setFormData(rest as UserFormData);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsedValue = numericFields.has(name) ? Number(value) : value;

        if (name.includes(".")) {
            setFormData((prev) => setNestedValue(prev, name, parsedValue));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    const renderFields = (title: string, fields: FieldConfig[]) => (
        <div className="settings-card">
            <h2>{title}</h2>
            <div className="settings-grid">
                {fields.map((field) => (
                    <div className="form-group" key={field.name}>
                        <label>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={getValue(formData, field.name)}
                            onChange={handleChange}
                            placeholder={field.label}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            await updateUser(userId, formData);
            toast.success("Settings updated successfully");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your profile and account information</p>
            </div>

            {loading ? (
                <div className="skeleton-loading-container">
                    <SkeletonFormSection fields={6} />
                    <SkeletonFormSection fields={10} />
                    <SkeletonFormSection fields={8} />
                    <SkeletonFormSection fields={4} />
                </div>
            ) : (
                <form className="settings-form" onSubmit={handleSubmit}>
                    {renderFields("Profile Information", profileFields)}
                    {renderFields("Personal Information", personalFields)}
                    {renderFields("Address Information", addressFields)}
                    {renderFields("Professional Information", professionalFields)}

                    <div className="settings-actions">
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? "Saving..." : "Save Settings"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Settings;