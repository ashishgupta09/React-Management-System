import { BASE_URL } from "./api";
import type { UserData, UserFormData } from "../interfaces/user.interface";

const USER_API = `${BASE_URL}/api/userData`;

export const getUsers = async (): Promise<UserData[]> => {
    const response = await fetch(USER_API);

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
};

export const getUserById = async (id: string): Promise<UserData> => {
    const response = await fetch(`${USER_API}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch user details");
    }

    return response.json();
};

export const addUser = async (data: UserFormData): Promise<UserData> => {
    const response = await fetch(USER_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to add user");
    }

    return response.json();
};

export const updateUser = async (
    id: string,
    data: UserFormData
): Promise<UserData> => {
    const response = await fetch(`${USER_API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${USER_API}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }
};