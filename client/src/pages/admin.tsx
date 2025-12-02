import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, X, Clock, Shield, Search, Filter, Store, Lock, KeyRound, ChevronRight, CreditCard, Settings, Key, AlertTriangle, MessageSquare, DollarSign, User } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { useShopStore } from "@/lib/shop-store";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { requests, approveRequest, rejectRequest, adminCard, setAdminCard, adminPin, setAdminPin, loginAttempts, lockoutUntil, recordFailedAttempt, resetSecurity, botConfig, setBotConfig, listingPrice, setListingPrice, adminTelegramId, setAdminTelegramId } = useAdminStore();
  const { addListingsLimit } = useShopStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings Form State
  const [cardForm, setCardForm] = useState(adminCard);
  const [pinForm, setPinForm] = useState({ current: "", new: "", confirm: "" });
  const [botForm, setBotForm] = useState(botConfig);
  const [priceForm, setPriceForm] = useState(listingPrice);
  const [telegramForm, setTelegramForm] = useState(adminTelegramId);
  const [activeTab, setActiveTab] = useState<'card' | 'security' | 'bot' | 'pricing' | 'contact'>('card');
  const [viewImage, setViewImage] = useState<string | null>(null);

  // SECURITY: Admin Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Check Lockout Status
  useEffect(() => {
    if (lockoutUntil && lockoutUntil > Date.now()) {
      setIsLocked(true);
      const interval = setInterval(() => {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsLocked(false);
          resetSecurity();
          clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else if (lockoutUntil && lockoutUntil <= Date.now()) {
      resetSecurity();
      setIsLocked(false);
    }
  }, [lockoutUntil]);

  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.status === filter
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;

    if (pin === adminPin) {
      setIsAuthenticated(true);
      resetSecurity(); // Reset attempts on successful login
      toast({
        title: "Xush kelibsiz, Admin!",
        description: "Tizimga muvaffaqiyatli kirdingiz.",
      });
    } else {
      setError(true);
      setPin("");
      recordFailedAttempt(); // Increment failed attempts
      
      // Check if this attempt caused a lockout
      if (loginAttempts + 1 >= 3) {
         toast({
          variant: "destructive",
          title: "Tizim bloklandi!",
          description: "Juda ko'p noto'g'ri urinishlar. 24 soat kuting.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Xato kod",
          description: `Kirish kodi noto'g'ri. ${3 - (loginAttempts + 1)} ta urinish qoldi.`,
        });
      }
    }
  };

  const handleApprove = (id: string, name: string, count: number) => {
    approveRequest(id);
    addListingsLimit(count);
    toast({
      title: "Tasdiqlandi ✅",
      description: `${name} uchun Premium aktivlashtirildi. +${count} e'lon qo'shildi.`,
    });
  };

  const handleReject = (id: string, name: string) => {
    rejectRequest(id);
    toast({
      variant: "destructive",
      title: "Rad etildi ❌",
      description: `${name}ning so'rovi bekor qilindi.`,
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'card') {
      setAdminCard(cardForm);
      toast({ description: "To'lov ma'lumotlari yangilandi!" });
    } else if (activeTab === 'bot') {
      setBotConfig(botForm);
      toast({ description: "Bot sozlamalari saqlandi!" });
    } else if (activeTab === 'pricing') {
      setListingPrice(priceForm);
      toast({ description: "Narxlar yangilandi!" });
    } else if (activeTab === 'contact') {
      setAdminTelegramId(telegramForm);
      toast({ description: "Telegram kontakt yangilandi!" });
    } else {
      // Change Password Logic
      if (pinForm.current !== adminPin) {
        toast({ variant: "destructive", description: "Joriy parol noto'g'ri!" });
        return;
      }
      if (pinForm.new.length < 4) {
        toast({ variant: "destructive", description: "Yangi parol kamida 4 ta raqam bo'lishi kerak." });
        return;
      }
      if (pinForm.new !== pinForm.confirm) {
        toast({ variant: "destructive", description: "Yangi parollar mos kelmadi." });
        return;
      }
      
      setAdminPin(pinForm.new);
      setPinForm({ current: "", new: "", confirm: "" });
      toast({ description: "Parol muvaffaqiyatli o'zgartirildi!" });
    }
    setIsSettingsOpen(false);
  };

  // If not authenticated, show Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border transition-all ${isLocked ? 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
              {isLocked ? <AlertTriangle size={40} /> : <Lock size={40} />}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Kirish</h1>
            {isLocked ? (
              <p className="text-red-400 text-sm font-bold">
                Tizim vaqtincha bloklandi: {formatTime(timeLeft)}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">Davom etish uchun maxsus kodni kiriting</p>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                disabled={isLocked}
                placeholder={isLocked ? "Bloklangan" : "PIN kod..."}
                className={`w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all text-lg tracking-widest text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                  error ? "border-red-500 focus:border-red-500" : "border-gray-700 focus:border-blue-500"
                }`}
                maxLength={4}
                autoFocus
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLocked}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 ${
                isLocked 
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
              }`}
            >
              {isLocked ? "Kuting..." : "Kirish"} {isLocked ? <Clock size={20} /> : <ChevronRight size={20} />}
            </button>
          </form>

          <Link href="/">
            <button className="w-full mt-4 text-gray-500 hover:text-gray-300 text-sm py-2 transition-colors">
              Bosh sahifaga qaytish
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Main Admin Dashboard Content
  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-md text-white pt-6 pb-8 px-6 rounded-b-[2rem] shadow-xl relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Shield size={24} className="text-blue-400" />
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 backdrop-blur flex items-center justify-center hover:bg-red-500/30 transition-colors"
            >
              <Lock size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 justify-between text-center">
          <div className="bg-white/10 rounded-xl p-3 flex-1 backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="text-xs text-gray-400">Kutilmoqda</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 flex-1 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">{requests.filter(r => r.status === 'approved').length}</div>
            <div className="text-xs text-gray-400">Tasdiqlandi</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 flex-1 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{requests.length}</div>
            <div className="text-xs text-gray-400">Jami</div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {viewImage && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewImage(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            >
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="bg-background p-2 rounded-2xl max-w-sm w-full relative"
                 onClick={(e) => e.stopPropagation()}
               >
                 <button 
                   onClick={() => setViewImage(null)}
                   className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold shadow-lg"
                 >
                   <X size={16} />
                 </button>
                 <img src={viewImage} alt="Chek" className="w-full rounded-xl" />
                 <div className="mt-2 text-center">
                   <a href={viewImage} download="check.png" className="text-xs text-primary font-medium hover:underline">
                     Yuklab olish
                   </a>
                 </div>
               </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] bg-background rounded-3xl z-50 shadow-2xl border border-border max-w-md mx-auto overflow-hidden"
            >
              <div className="bg-primary/5 p-5 border-b border-border flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Settings size={20} className="text-primary" />
                  Admin Sozlamalari
                </h3>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-border p-2 gap-2 overflow-x-auto hide-scrollbar">
                <button 
                  onClick={() => setActiveTab('card')}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'card' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  Karta
                </button>
                <button 
                  onClick={() => setActiveTab('bot')}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'bot' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  Bot
                </button>
                <button 
                  onClick={() => setActiveTab('pricing')}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'pricing' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  Narxlar
                </button>
                <button 
                  onClick={() => setActiveTab('contact')}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'contact' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  Kontakt
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'security' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  Xavfsizlik
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
                {activeTab === 'card' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Karta Raqami</label>
                      <input 
                        value={cardForm.number}
                        onChange={(e) => setCardForm({...cardForm, number: e.target.value})}
                        className="w-full p-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none font-mono"
                        placeholder="8600 0000 0000 0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Karta Egasi</label>
                      <input 
                        value={cardForm.holder}
                        onChange={(e) => setCardForm({...cardForm, holder: e.target.value})}
                        className="w-full p-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none"
                        placeholder="ISM FAMILIYA"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Bank Nomi</label>
                      <input 
                        value={cardForm.bank}
                        onChange={(e) => setCardForm({...cardForm, bank: e.target.value})}
                        className="w-full p-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none"
                        placeholder="Bank Nomi"
                      />
                    </div>
                  </>
                ) : activeTab === 'bot' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Bot Username</label>
                      <div className="flex items-center bg-secondary/50 rounded-xl border border-transparent focus-within:border-primary overflow-hidden">
                        <span className="pl-3 text-muted-foreground">@</span>
                        <input 
                          value={botForm.username}
                          onChange={(e) => setBotForm({...botForm, username: e.target.value})}
                          className="w-full p-3 bg-transparent outline-none"
                          placeholder="yangiyer_smart_bot"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Buyurtmalar shu botga yo'naltiriladi.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                        Bot Token
                      </label>
                      <input 
                        value={botForm.token}
                        onChange={(e) => setBotForm({...botForm, token: e.target.value})}
                        className="w-full p-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none font-mono text-xs"
                        placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                        Channel ID
                      </label>
                      <input 
                        value={botForm.chatId}
                        onChange={(e) => setBotForm({...botForm, chatId: e.target.value})}
                        className="w-full p-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none font-mono text-xs"
                        placeholder="-1001234567890"
                      />
                    </div>
                  </>
                ) : activeTab === 'pricing' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Qo'shimcha 10 ta e'lon narxi</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                          value={priceForm}
                          onChange={(e) => setPriceForm(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none font-bold text-lg"
                          placeholder="1.50"
                          type="number"
                          step="0.01"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Foydalanuvchi 10 ta bepul e'londan so'ng har 10 ta yangi e'lon uchun shu summani to'laydi.
                      </p>
                    </div>
                  </>
                ) : activeTab === 'contact' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Admin Telegram ID</label>
                      <div className="flex items-center bg-secondary/50 rounded-xl border border-transparent focus-within:border-primary overflow-hidden">
                        <span className="pl-3 text-muted-foreground">@</span>
                        <input 
                          value={telegramForm}
                          onChange={(e) => setTelegramForm(e.target.value)}
                          className="w-full p-3 bg-transparent outline-none"
                          placeholder="admin_username"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Foydalanuvchilar chekni shu profilga yuborishadi.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Joriy Parol</label>
                      <input 
                        type="password"
                        value={pinForm.current}
                        onChange={(e) => setPinForm({...pinForm, current: e.target.value})}
                        className="w-full p-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none"
                        placeholder="****"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Yangi Parol</label>
                      <input 
                        type="password"
                        value={pinForm.new}
                        onChange={(e) => setPinForm({...pinForm, new: e.target.value})}
                        className="w-full p-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none"
                        placeholder="****"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Yangi Parolni Tasdiqlang</label>
                      <input 
                        type="password"
                        value={pinForm.confirm}
                        onChange={(e) => setPinForm({...pinForm, confirm: e.target.value})}
                        className="w-full p-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none"
                        placeholder="****"
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold mt-2"
                >
                  Saqlash
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors backdrop-blur-sm ${
                filter === f 
                  ? "bg-gray-900 text-white" 
                  : "bg-secondary/80 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f === 'all' ? 'Barchasi' : f === 'pending' ? 'Kutilmoqda' : f === 'approved' ? 'Tasdiqlangan' : 'Rad etilgan'}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div className="px-4 space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
            <Search size={48} className="mb-4" />
            <p>So'rovlar topilmadi</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredRequests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-card/80 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-sm relative overflow-hidden"
              >
                {/* Status Indicator Strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  req.status === 'pending' ? 'bg-yellow-500' : 
                  req.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                }`} />

                <div className="pl-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm">{req.userName}</h3>
                      <p className="text-xs text-muted-foreground">ID: #{req.userId.slice(0,6)}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-primary">{req.amount}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(req.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="bg-secondary/30 p-2 rounded-lg mb-3 border border-border/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-background p-1.5 rounded-md shadow-sm text-muted-foreground">
                        <Store size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Do'kon Nomi</p>
                        <p className="text-xs font-bold">{req.senderName || "Noma'lum"}</p>
                      </div>
                    </div>
                    
                    {req.checkImage && (
                      <button 
                        onClick={() => setViewImage(req.checkImage!)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        <CreditCard size={12} />
                        Chekni ko'rish
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md font-medium uppercase">
                      {req.listingsCount} ta e'lon
                    </span>
                    {req.status === 'pending' && (
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                        <Clock size={10} /> Kutilmoqda
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                        <Check size={10} /> Tasdiqlandi
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                        <X size={10} /> Rad etildi
                      </span>
                    )}
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex gap-3 pt-2 border-t border-border/50">
                      <button 
                        onClick={() => handleReject(req.id, req.userName)}
                        className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <X size={14} /> Rad etish
                      </button>
                      <button 
                        onClick={() => handleApprove(req.id, req.userName, req.listingsCount)}
                        className="flex-1 py-2.5 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Check size={14} /> Tasdiqlash
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
