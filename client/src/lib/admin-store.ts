import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PremiumRequest {
  id: string;
  userId: string;
  userName: string;
  senderName: string; // Do'kon nomi
  plan: 'monthly' | 'yearly';
  amount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminStore {
  requests: PremiumRequest[];
  approvedShops: string[]; // Tasdiqlangan do'kon nomlari ro'yxati
  addRequest: (request: Omit<PremiumRequest, 'id' | 'date' | 'status'>) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  pendingCount: () => number;
  isShopPremium: (shopName: string) => boolean;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      requests: [],
      approvedShops: [],
      
      addRequest: (req) => set((state) => ({
        requests: [
          {
            ...req,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            status: 'pending'
          },
          ...state.requests
        ]
      })),

      approveRequest: (id) => set((state) => {
        const request = state.requests.find(r => r.id === id);
        const shopName = request?.senderName;
        
        // Agar request topilsa va shopName bo'lsa, uni approvedShops ga qo'shamiz
        const newApprovedShops = shopName 
          ? [...state.approvedShops, shopName] 
          : state.approvedShops;

        return {
          requests: state.requests.map(req => 
            req.id === id ? { ...req, status: 'approved' } : req
          ),
          approvedShops: newApprovedShops
        };
      }),

      rejectRequest: (id) => set((state) => ({
        requests: state.requests.map(req => 
          req.id === id ? { ...req, status: 'rejected' } : req
        )
      })),

      pendingCount: () => get().requests.filter(r => r.status === 'pending').length,
      
      isShopPremium: (shopName: string) => {
        if (!shopName) return false;
        return get().approvedShops.includes(shopName);
      }
    }),
    {
      name: 'admin-storage',
    }
  )
);
