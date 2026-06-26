import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials:true // lets the refreshToken cookie flow automatically
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
                    await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refreshToken`,
                    { withCredentials: true }
                    );
                    return api(original);
                } catch {
                    window.location.href = "/login";
                }
            }

            return Promise.reject(error);
        }
    );

export default api;
