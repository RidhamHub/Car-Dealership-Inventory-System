import { createContext, useContext, useState } from "react";
import api from "../lib/api";

// Holds the logged-in user and exposes login/register/logout to the whole app.
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Load any previously saved user so a refresh keeps you logged in.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Save the token + user after a successful login/register.
  const save = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    save(data.token, data.user);
    return data.user;
  };

  const login = async (form) => {
    const { data } = await api.post("/auth/login", form);
    save(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = { user, isAdmin: user?.role === "admin", register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
