import axios from "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        // Set on requests that are allowed to fail silently when the user
        // simply isn't logged in (e.g. "am I logged in?" checks on public
        // pages) instead of being bounced to /login.
        skipAuthRedirect?: boolean;
    }
}

const api = axios.create({
    baseURL: "", // relative — routes through the Next.js rewrite proxy in next.config.ts, so Set-Cookie lands on this domain instead of the backend's
    withCredentials: true
})



//Attach the access token to every request if it exists
    // We don't need this because the backend reads the HttpOnly 
    // refreshToken cookie automatically and issues a new access token when needed. 
    // The frontend just needs to handle the 401 response and retry the request with the new access token.
// api.interceptors.request.use((config) => {
//     if (typeof window !== "undefined") {
//         const token = localStorage.getItem("accessToken");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
    

//     }

//     return config;
// });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const original = error.config;

            if (error.response?.status === 401 && !original._retry) {
                original._retry = true;

                try {
                    await axios.get("/api/auth/refreshToken", { withCredentials: true });

                    return api(original);
                } catch {
                    if (!original.skipAuthRedirect) {
                        window.location.href = "/login";
                    }
                }
            }

            return Promise.reject(error);
        }
    );

export default api;
