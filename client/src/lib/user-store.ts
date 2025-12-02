import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  name: string;
  phone: string;
  isRegistered: boolean;
  setUser: (info: { name: string; phone: string }) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: "",
      phone: "",
      isRegistered: false,
      
      setUser: (info) => set({ 
        name: info.name, 
        phone: info.phone,
        isRegistered: true 
      }),
      
      logout: () => set({ 
        name: "", 
        phone: "",
        isRegistered: false 
      }),
    }),
    {
      name: 'user-storage',
    }
  )
);
