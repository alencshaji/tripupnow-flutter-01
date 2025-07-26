import axios from "axios";
import { backendUrl } from "./app-globals";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
 baseURL: backendUrl,
  withCredentials: true, // sends cookies
});

// Attach token
api.interceptors.request.use(config => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const auth = useAuthStore();
        const newToken = await auth.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
