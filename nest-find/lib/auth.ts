import api from "@/lib/api";

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
