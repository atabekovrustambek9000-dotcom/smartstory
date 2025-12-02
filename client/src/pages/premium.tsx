import { ArrowLeft, Check, Crown, Star, Zap, CreditCard, Copy, X, ShieldCheck, Store, ShoppingBag, Upload, Image as ImageIcon, Send } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/lib/admin-store";
import { useShopStore } from "@/lib/shop-store";

export default function Premium() {
  const [selectedPackage, setSelectedPackage] = useState(10);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [checkImage, setCheckImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { addRequest, adminCard, listingPrice, adminTelegramId } = useAdminStore();
  const { shopName } = useShopStore();

  // Auto-fill shop name
  useEffect(() => {
    if (shopName) {
      setSenderName(shopName);
    }
  }, [shopName]);

  const handleSubscribe = () => {
    setIsPaymentModalOpen(true);
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText(adminCard.number.replace(/\s/g, ''));
    toast({
      description: "Karta raqami nusxalandi!",
      duration: 1500,
    });
  };

  // Calculate Price
  const calculatePrice = () => {
    const unitPrice = parseFloat(listingPrice);
    const multiplier = selectedPackage / 10;
    return (unitPrice * multiplier).toFixed(2);
  };

  const handleCheckUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCheckImage(imageUrl);
      toast({
        description: "To'lov cheki yuklandi",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSendToTelegram = () => {
    if (!adminTelegramId) {
       toast({ variant: "destructive", description: "Admin Telegram manzili sozlanmagan" });
       return;
    }
    const tgUrl = `https://t.me/${adminTelegramId.replace('@', '')}`;
    window.open(tgUrl, '_blank');
    
    toast({
        description: "Telegram ochilmoqda. Chekni yuboring.",
        duration: 3000
    });
  };

  const handleConfirmPayment = () => {
    if (!senderName.trim()) {
      toast({
        variant: "destructive",
        description: "Iltimos, do'koningiz nomini kiriting",
      });
      return;
    }
    
    if (!checkImage) {
        toast({
            variant: "destructive",
            description: "Iltimos, to'lov chekini yuklang",
        });
        return;
    }

    // Add request to admin store
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const fullName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Foydalanuvchi';
    const userId = tgUser?.id ? String(tgUser.id) : '7823';

    addRequest({
      userId: userId,
      userName: fullName, // Real Telegram user name
      senderName: senderName, // Shop Name
      listingsCount: selectedPackage,
      amount: `$${calculatePrice()}`,
      // @ts-ignore - plan field is deprecated but kept for interface compatibility if needed temporarily
      plan: 'monthly' 
    });

    setIsPaymentModalOpen(false);
    setCheckImage(null);
    
    toast({
      title: "So'rov yuborildi! 🚀",
      description: "Chek va ma'lumotlar Adminga avtomatik yuborildi. Tasdiqlashni kuting.",
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-gray-900 text-white pb-10 pt-6 px-6 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-purple-600 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10">
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-6 hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 rotate-3">
              <ShoppingBag size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold mb-2">E'lonlar olish</h1>
            <p className="text-gray-300 text-sm max-w-[260px]">
              Do'koningizni rivojlantirish uchun qo'shimcha e'lonlar paketini tanlang.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-6">
        
        {/* Package Selection */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-center mb-4 uppercase text-xs text-muted-foreground tracking-wider">
                Qo'shimcha E'lonlar Soni
            </h3>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {[10, 20, 30, 40, 50].map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedPackage(count)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all border-2 ${
                    selectedPackage === count 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110 z-10" 
                      : "bg-secondary/50 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>+{count}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Jami To'lov</p>
                <div className="flex items-end gap-1 text-foreground">
                    <span className="text-4xl font-extrabold tracking-tighter">${calculatePrice()}</span>
                    <span className="text-sm font-bold mb-1.5 opacity-70">USD</span>
                </div>
                <div className="mt-2 text-[10px] text-center text-green-600 bg-green-50 dark:bg-green-900/20 py-1 px-2 rounded-md">
                    {selectedPackage} ta yangi e'lon qo'shiladi
                </div>
            </div>
        </div>

        {/* Features */}
        <div className="space-y-3 opacity-80">
          <div className="flex items-center gap-3 px-2">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <Check size={14} />
            </div>
            <p className="text-xs text-muted-foreground">E'lonlar muddatsiz saqlanadi</p>
          </div>
          <div className="flex items-center gap-3 px-2">
             <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <Check size={14} />
            </div>
            <p className="text-xs text-muted-foreground">Bot orqali xabarnoma yuborish</p>
          </div>
          <div className="flex items-center gap-3 px-2">
             <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <Check size={14} />
            </div>
            <p className="text-xs text-muted-foreground">Tezkor moderatsiya</p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button 
            onClick={handleSubscribe}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-xl shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Sotib olish
            <ArrowLeft className="rotate-180" size={20} />
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[5%] md:top-[10%] bg-background rounded-3xl z-50 shadow-2xl border border-border max-w-md mx-auto overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-primary/5 p-6 border-b border-border flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="font-bold text-lg">To'lov qilish</span>
                 </div>
                 <button onClick={() => setIsPaymentModalOpen(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                   <X size={18} />
                 </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-1">Jami summa</p>
                  <h2 className="text-4xl font-bold text-foreground">${calculatePrice()}</h2>
                  <span className="text-xs font-medium bg-secondary px-2 py-1 rounded mt-2 inline-block">
                    +{selectedPackage} ta e'lon uchun
                  </span>
                </div>

                <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50 space-y-4">
                  <p className="text-sm font-medium text-center text-muted-foreground">To'lovni ushbu kartaga o'tkazing:</p>
                  
                  <div className="bg-background p-4 rounded-xl border border-border shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <CreditCard size={64} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs text-muted-foreground mb-1">Karta raqami</p>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-lg font-mono font-bold text-foreground tracking-wider">
                          {adminCard.number}
                        </code>
                        <button 
                          onClick={handleCopyCard}
                          className="p-2 hover:bg-secondary rounded-lg text-primary transition-colors active:scale-90"
                        >
                          <Copy size={18} />
                        </button>
                      </div>
                      <div className="mt-3 flex justify-between items-end">
                         <div>
                           <p className="text-[10px] text-muted-foreground">Karta egasi</p>
                           <p className="text-sm font-bold">{adminCard.holder}</p>
                         </div>
                         <p className="text-[10px] font-medium bg-secondary px-2 py-1 rounded">{adminCard.bank}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Do'koningiz nomi</label>
                  <div className="relative">
                    <Store size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Masalan: Tech Store..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {/* Check Upload Area */}
                <div className="space-y-2">
                   <label className="text-sm font-medium ml-1">To'lov cheki (Skrinshot)</label>
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleCheckUpload}
                    />
                   
                   <div 
                     onClick={triggerFileInput}
                     className={`border-2 border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center text-muted-foreground bg-secondary/20 relative overflow-hidden transition-all cursor-pointer hover:bg-secondary/40 ${checkImage ? 'border-primary/50' : ''}`}
                   >
                      {checkImage ? (
                        <div className="relative w-full h-full group">
                           <img src={checkImage} alt="Chek" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                                <Upload size={20} />
                              </div>
                           </div>
                           <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                              <Check size={10} /> Yuklandi
                           </div>
                        </div>
                      ) : (
                        <>
                           <div className="w-10 h-10 rounded-full bg-background shadow-sm flex items-center justify-center mb-2">
                             <Upload size={18} className="text-primary" />
                           </div>
                           <span className="text-xs font-medium">Chekni yuklash</span>
                        </>
                      )}
                   </div>
                   <p className="text-[10px] text-muted-foreground ml-1">
                     To'lovni tasdiqlash uchun chekni yuklash majburiy.
                   </p>
                </div>

                <button 
                  onClick={handleConfirmPayment}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Tasdiqlash va Yuborish
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
