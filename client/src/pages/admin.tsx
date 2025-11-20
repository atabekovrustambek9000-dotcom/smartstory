import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, X, Clock, Shield, Search, Filter, Store, Lock, KeyRound, ChevronRight } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { requests, approveRequest, rejectRequest } = useAdminStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // SECURITY: Admin Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.status === filter
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple frontend protection for mockup
    if (pin === "7777") {
      setIsAuthenticated(true);
      toast({
        title: "Xush kelibsiz, Admin!",
        description: "Tizimga muvaffaqiyatli kirdingiz.",
      });
    } else {
      setError(true);
      setPin("");
      toast({
        variant: "destructive",
        title: "Xato kod",
        description: "Kirish kodi noto'g'ri.",
      });
    }
  };

  const handleApprove = (id: string, name: string) => {
    approveRequest(id);
    toast({
      title: "Tasdiqlandi ✅",
      description: `${name} uchun Premium aktivlashtirildi.`,
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

  // If not authenticated, show Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-blue-500/30">
              <Lock size={40} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Kirish</h1>
            <p className="text-gray-400 text-sm">Davom etish uchun maxsus kodni kiriting</p>
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
                placeholder="PIN kod..."
                className={`w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all text-lg tracking-widest text-center ${
                  error ? "border-red-500 focus:border-red-500" : "border-gray-700 focus:border-blue-500"
                }`}
                maxLength={4}
                autoFocus
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              Kirish <ChevronRight size={20} />
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gray-900 text-white pt-6 pb-8 px-6 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield size={24} className="text-blue-400" />
            Admin Panel
          </h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="ml-auto p-2 bg-white/10 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <Lock size={18} />
          </button>
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

      {/* Filters */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                filter === f 
                  ? "bg-gray-900 text-white" 
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
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
                className="bg-card border border-border p-4 rounded-2xl shadow-sm relative overflow-hidden"
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
                  <div className="bg-secondary/30 p-2 rounded-lg mb-3 border border-border/50 flex items-center gap-2">
                    <div className="bg-background p-1.5 rounded-md shadow-sm text-muted-foreground">
                      <Store size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Do'kon Nomi</p>
                      <p className="text-xs font-bold">{req.senderName || "Noma'lum"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md font-medium uppercase">
                      {req.plan === 'monthly' ? 'Oylik' : 'Yillik'} Reja
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
                        onClick={() => handleApprove(req.id, req.userName)}
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
