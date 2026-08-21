import api from "@/lib/api"

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const res = await api.patch("/api/users/password", {currentPassword, newPassword});
    return res.data;

}

export const changeUsername = async (username: string) => {
    const res = await api.patch("/api/users/username", {username});
    return res.data;
}

export const requestEmailChange = async (newEmail: string, currentPassword: string) => {
    const res = await api.post("/api/users/email/request-change", {newEmail, currentPassword});
    return res.data;
}

export const confirmEmailChange = async (token: string) => {
    const res = await api.post("/api/users/email/confirm-change", {token});
    return res.data;
}