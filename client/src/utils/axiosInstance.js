// src/utils/axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/v1";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

// Attach token from localStorage or Cookies
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") || Cookies.get("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${BASE}/auth/refresh-tokens`,
          {
            refreshToken:
              localStorage.getItem("refreshToken") || Cookies.get("refreshToken"),
          },
          { withCredentials: true }
        );

        if (data?.access?.token) {
          // keep both stores in sync
          localStorage.setItem("accessToken", data.access.token);
          localStorage.setItem("refreshToken", data.refresh.token);
          Cookies.set("accessToken", data.access.token);
          Cookies.set("refreshToken", data.refresh.token);

          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${data.access.token}`;
          return api.request(original);
        }
      } catch (_) {
        // optional: clear tokens on hard failure
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
