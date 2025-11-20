import { ArrowLeft, Check, Crown, Star, Zap, CreditCard, Copy, X, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { toast } = useToast();

  // SOTUVCHINING KARTASI (Sizning kartangiz)
  // Xaridorlar shu kartaga pul o'tkazganda ishlatiladi
  const adminCard = {
    number: "8600 1234 5678 9999", 
    holder: "YANGIYER ADMIN",
    bank: "Ipak Yuli Bank"
  };

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

  const handleConfirmPayment = () => {
    setIsPaymentModalOpen(false);
    toast({
      title: "So'rov yuborildi!",
      description: "To'lov tekshirilgandan so'ng Premium aktivlashtiriladi.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-gray-900 text-white pb-10 pt-6 px-6 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-yellow-500 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-purple-600 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10">
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-6 hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-300 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-6 rotate-3">
              <Crown size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Premium-ga o'tish</h1>
            <p className="text-gray-300 text-sm max-w-[260px]">
              Cheksiz imkoniyatlar va ko'proq xaridorlarga ega bo'ling.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-6">
        {/* Plan Switcher */}
        <div className="bg-white p-1.5 rounded-xl shadow-lg flex relative">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gray-900 rounded-lg transition-all duration-300 ${selectedPlan === 'monthly' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
          />
          <button 
            onClick={() => setSelectedPlan("monthly")}
            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${selectedPlan === "monthly" ? "text-white" : "text-gray-500"}`}
          >
            Oylik
          </button>
          <button 
            onClick={() => setSelectedPlan("yearly")}
            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${selectedPlan === "yearly" ? "text-white" : "text-gray-500"}`}
          >
            Yillik <span className="text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded ml-1">-20%</span>
          </button>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cheksiz E'lonlar</h3>
              <p className="text-xs text-muted-foreground">Istaganingizcha mahsulot joylashtiring.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Top Do'kon</h3>
              <p className="text-xs text-muted-foreground">Qidiruv natijalarida eng yuqorida turing.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <Check size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">0% Komissiya</h3>
              <p className="text-xs text-muted-foreground">Sotuvdan tushgan pul 100% sizniki.</p>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="pt-4">
          <div className="flex flex-col items-center mb-6">
            <div className="text-3xl font-bold text-foreground">
              {selectedPlan === "monthly" ? "$1.50" : "$13.00"}
              <span className="text-sm text-muted-foreground font-normal">
                /{selectedPlan === "monthly" ? "oy" : "yil"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Istalgan vaqtda bekor qilish mumkin.</p>
          </div>

          <button 
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Obuna bo'lish
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
              className="fixed inset-x-4 top-[10%] md:top-[15%] bg-background rounded-3xl z-50 shadow-2xl border border-border max-w-md mx-auto overflow-hidden"
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
                  <h2 className="text-4xl font-bold text-foreground">{selectedPlan === "monthly" ? "$1.50" : "$13.00"}</h2>
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

                  <div className="text-xs text-center text-muted-foreground bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 p-3 rounded-lg">
                    Izohda <strong>Shop ID: #7823</strong> ni yozib qoldiring.
                  </div>
                </div>

                <button 
                  onClick={handleConfirmPayment}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                  To'lov qildim
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
