import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ShopStore {
  shopName: string;
  description: string;
  phone: string;
  setShopInfo: (info: Partial<{ shopName: string; description: string; phone: string }>) => void;
}

export const useShopStore = create<ShopStore>()(
  persist(
    (set) => ({
      shopName: "Tech Haven", // Default name
      description: "Best gadgets in town!",
      phone: "+998 90 123 45 67",
      setShopInfo: (info) => set((state) => ({ ...state, ...info })),
    }),
    {
      name: 'shop-storage',
    }
  )
);
