import { BASE_URL } from "./api";
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
} from "../interfaces/auth.interface.tsx";

export const loginUser = async (
    data: LoginRequest
): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Login failed");
    }

    return result;
};

export const registerUser = async (
    data: RegisterRequest
): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Registration failed");
    }

    return result;
};