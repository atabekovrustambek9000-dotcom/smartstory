import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/user-store";
import { useShopStore } from "@/lib/shop-store";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, User, Phone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Welcome() {
  const { setUser } = useUserStore();
  const { setShopInfo } = useShopStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998");

  // Auto-detect Telegram User
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      const user = tg.initDataUnsafe.user;
      setName(`${user.first_name} ${user.last_name || ""}`.trim());
    }
    
    // Expand Telegram WebApp
    tg?.expand();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.length < 3) {
      toast({
        variant: "destructive",
        description: "Ismingizni to'liq kiriting",
      });
      return;
    }

    if (phone.length < 9) {
      toast({
        variant: "destructive",
        description: "Telefon raqamingizni to'liq kiriting",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call/Setup
    setTimeout(() => {
      // Save User
      setUser({ name, phone });
      
      // Initialize Shop with User Info
      setShopInfo({
        shopName: `${name} Do'koni`,
        phone: phone,
        description: "Yangi ochilgan do'kon"
      });

      toast({
        title: "Xush kelibsiz!",
        description: "Tizimga muvaffaqiyatli kirdingiz",
      });
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-primary to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30 rotate-6">
            <ShoppingBag size={48} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Smart Store</h1>
          <p className="text-muted-foreground text-sm">
            Online savdo platformasiga xush kelibsiz. Davom etish uchun ma'lumotlaringizni kiriting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Ism-Familiya</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingizni kiriting"
                className="w-full pl-10 pr-4 py-3.5 bg-secondary/50 border border-transparent focus:border-primary focus:bg-background rounded-2xl outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Telefon raqam</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full pl-10 pr-4 py-3.5 bg-secondary/50 border border-transparent focus:border-primary focus:bg-background rounded-2xl outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Yuklanmoqda...
              </>
            ) : (
              <>
                Kirish
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Davom etish orqali siz foydalanish shartlariga rozilik bildirasiz.
        </p>
      </motion.div>
    </div>
  );
}
