import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PremiumRequest {
  id: string;
  userId: string;
  userName: string;
  plan: 'monthly' | 'yearly';
  amount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminStore {
  requests: PremiumRequest[];
  addRequest: (request: Omit<PremiumRequest, 'id' | 'date' | 'status'>) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  pendingCount: () => number;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      requests: [],
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
      approveRequest: (id) => set((state) => ({
        requests: state.requests.map(req => 
          req.id === id ? { ...req, status: 'approved' } : req
        )
      })),
      rejectRequest: (id) => set((state) => ({
        requests: state.requests.map(req => 
          req.id === id ? { ...req, status: 'rejected' } : req
        )
      })),
      pendingCount: () => get().requests.filter(r => r.status === 'pending').length,
    }),
    {
      name: 'admin-storage',
    }
  )
);
