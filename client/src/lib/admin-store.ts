import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PremiumRequest {
  id: string;
  userId: string;
  userName: string;
  senderName: string; // Do'kon nomi
  listingsCount: number; // Sotib olinayotgan e'lonlar soni
  amount: string;
  checkImage?: string; // Base64 or URL of the payment receipt
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminCard {
  number: string;
  holder: string;
  bank: string;
}

interface BotConfig {
  username: string; // Bot username without @ (e.g. yangiyer_smart_bot)
  token: string;    // Bot Token (optional for frontend-only)
  chatId: string;   // Channel/Admin ID (optional)
}

interface AdminStore {
  requests: PremiumRequest[];
  approvedShops: string[]; // Tasdiqlangan do'kon nomlari ro'yxati
  adminCard: AdminCard; // Admin card details
  adminPin: string; // Admin PIN code
  botConfig: BotConfig; // Telegram Bot configuration
  listingPrice: string; // Price for additional 10 listings
  adminTelegramId: string; // Admin Telegram ID or Username for contact
  
  // Security State
  loginAttempts: number;
  lockoutUntil: number | null;

  setAdminCard: (card: Partial<AdminCard>) => void; // Function to update card details
  setAdminPin: (pin: string) => void; // Function to update PIN
  setBotConfig: (config: Partial<BotConfig>) => void; // Function to update Bot config
  setListingPrice: (price: string) => void; // Function to update listing price
  setAdminTelegramId: (id: string) => void; // Function to update Admin Telegram ID
  
  // Security Actions
  recordFailedAttempt: () => void;
  resetSecurity: () => void;

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
      adminCard: {
        number: "8600 1234 5678 9999",
        holder: "YANGIYER ADMIN",
        bank: "Ipak Yuli Bank"
      },
      adminPin: "7777", // Default PIN
      botConfig: {
        username: "yangiyer_smart_bot",
        token: "",
        chatId: ""
      },
      listingPrice: "1.50", // Default price
      adminTelegramId: "yangiyer_admin", // Default Admin Telegram
      
      loginAttempts: 0,
      lockoutUntil: null,

      setAdminCard: (card) => set((state) => ({
        adminCard: { ...state.adminCard, ...card }
      })),

      setAdminPin: (pin) => set(() => ({
        adminPin: pin
      })),

      setBotConfig: (config) => set((state) => ({
        botConfig: { ...state.botConfig, ...config }
      })),

      setListingPrice: (price) => set(() => ({
        listingPrice: price
      })),

      setAdminTelegramId: (id) => set(() => ({
        adminTelegramId: id
      })),

      recordFailedAttempt: () => set((state) => {
        const newAttempts = state.loginAttempts + 1;
        if (newAttempts >= 3) {
          return {
            loginAttempts: newAttempts,
            lockoutUntil: Date.now() + 24 * 60 * 60 * 1000 // Lock for 24 hours
          };
        }
        return { loginAttempts: newAttempts };
      }),

      resetSecurity: () => set(() => ({
        loginAttempts: 0,
        lockoutUntil: null
      })),
      
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
