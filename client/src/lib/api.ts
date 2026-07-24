import axios from "axios";

// Prefer an explicit VITE_API_BASE_URL (set per-environment). Otherwise default to
// localhost during dev and the deployed Render API for production builds.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://car-dealership-inventory-system-vl4p.onrender.com/api");

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      const path = window.location.pathname;
      if (!["/login", "/register", "/"].includes(path)) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export function getApiError(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
}
