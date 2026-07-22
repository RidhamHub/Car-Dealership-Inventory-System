import axios from "axios";

// One axios instance for the whole app. In dev, baseURL is /api and Vite
// proxies it to the backend; in production set VITE_API_URL to the live API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach the saved JWT to every request so protected routes work.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
