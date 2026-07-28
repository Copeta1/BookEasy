import { create } from "zustand";

type User = {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessId: number;
};

type AuthStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  setUser: (user) => {
    localStorage.setItem("token", user.token);
    document.cookie = `token=${user.token}; path=/`;
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    set({ user: null });
  },
}));