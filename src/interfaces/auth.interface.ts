export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface User {
    id: string | number;
    name: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: User;
}