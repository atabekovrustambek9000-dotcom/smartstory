import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ShopStore {
  shopName: string;
  description: string;
  phone: string;
  listingsUsed: number;
  listingsLimit: number;
  setShopInfo: (info: Partial<{ shopName: string; description: string; phone: string }>) => void;
  incrementListingsUsed: () => void;
  addListingsLimit: (amount: number) => void;
}

export const useShopStore = create<ShopStore>()(
  persist(
    (set) => ({
      shopName: "Tech Haven", // Default name
      description: "Best gadgets in town!",
      phone: "+998 90 123 45 67",
      listingsUsed: 3, // Mock initial usage
      listingsLimit: 10, // Initial free limit
      
      setShopInfo: (info) => set((state) => ({ ...state, ...info })),
      
      incrementListingsUsed: () => set((state) => ({ 
        listingsUsed: state.listingsUsed + 1 
      })),
      
      addListingsLimit: (amount) => set((state) => ({
        listingsLimit: state.listingsLimit + amount
      }))
    }),
    {
      name: 'shop-storage',
    }
  )
);
