// store/useAuthStore.ts
import { create } from "zustand";

// --- 1. Define your TypeScript Interfaces ---
interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number?: string; // optional
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role?: string; // optional, defaults to "user" in backend
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: RegisterData) => Promise<User | null>; // NEW
  logout: () => void;
}

// --- 2. Your API Base (matches your running server) ---
const API_BASE = "http://localhost:2009/api/users";

// --- 3. The Store ---
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state (read from localStorage)
  user: JSON.parse(localStorage.getItem("app_user") || "null"),
  token: localStorage.getItem("app_token") || null,
  isAuthenticated: !!localStorage.getItem("app_token"),
  loading: false,
  error: null,

  // --- LOGIN ---
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      // Save to localStorage
      localStorage.setItem("app_token", data.token);
      localStorage.setItem("app_user", JSON.stringify(data.user));

      // Update Zustand state
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return data.user;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- REGISTER (NEW) ---
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Registration failed");

      // 🎯 Auto-login after successful registration (smooth UX)
      // The user just registered, so we log them in immediately.
      const loggedInUser = await get().login(data.email, data.password);
      
      // If login failed for some weird reason, return null
      if (!loggedInUser) {
        throw new Error("Auto-login failed after registration.");
      }

      return loggedInUser;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // --- LOGOUT ---
  logout: () => {
    localStorage.removeItem("app_token");
    localStorage.removeItem("app_user");
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },
}));