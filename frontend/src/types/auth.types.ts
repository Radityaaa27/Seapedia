export interface UserRole {
    id: string;
    role: "ADMIN" | "BUYER" | "SELLER" | "DRIVER";
    isActive: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    isActive: boolean;
    roles: UserRole[];
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    phone: string;
}