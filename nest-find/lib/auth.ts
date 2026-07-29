import api from "@/lib/api";
import type { User } from "@/types/auth";

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const res = await api.get("/api/users/me", { skipAuthRedirect: true });
        return {
            id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            role: res.data.role,
        };
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
};

export const registerUser = async (username: string, email: string, password: string, role: "user" | "admin") => {
    const res = await api.post("/api/auth/register", { username, email, password, role });
    return res.data;
};

export const loginUser = async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
};

export const logoutUser = async () => {
    const res = await api.post("/api/auth/logout");
    return res.data;
};
