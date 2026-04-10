import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Waiter {
  id: string;
  nombre: string;
  usuario: string;
  activo: boolean;
}

interface AuthState {
  waiter: Waiter | null;
  isAuthenticated: boolean;
  login: (waiter: Waiter) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      waiter: null,
      isAuthenticated: false,

      login: (waiter: Waiter) => {
        set({ waiter, isAuthenticated: true });
      },

      logout: () => {
        set({ waiter: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
