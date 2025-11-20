import { ArrowLeft, Upload, DollarSign, AlertCircle, ShieldCheck, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddProduct() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Mock limit check
  const listingsUsed = 3;
  const listingsLimit = 10;
  const remaining = listingsLimit - listingsUsed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate AI Safety Check
    setIsAnalyzing(true);
    
    // Fake delay for "Analysis"
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsAnalyzing(false);
    
    toast({
      title: "Xavfsizlik tekshiruvi: Muvaffaqiyatli",
      description: "Mahsulot moderatsiyadan o'tdi va chop etildi.",
      duration: 3000,
    });
    
    setTimeout(() => setLocation("/profile"), 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-4">
        <Link href="/profile">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-lg font-bold">Mahsulot qo'shish</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Safety Badge */}
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
          <ShieldCheck size={14} />
          <span>AI Moderatsiya tizimi himoyalangan</span>
        </div>

        {/* Limit Warning */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">Bepul e'lonlar limiti</h4>
            <p className="text-xs text-blue-700 mt-0.5">
              Sizda {remaining} ta bepul e'lon qoldi.
            </p>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mahsulot rasmi</label>
          <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors group relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Upload size={20} className="text-primary" />
            </div>
            <span className="text-xs font-medium">Rasmni yuklash uchun bosing</span>
            <p className="text-[10px] text-muted-foreground mt-2 opacity-60">JPG, PNG (Max 5MB)</p>
            
            {/* Overlay for analysis simulation */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                >
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                  <span className="text-xs font-bold text-primary">AI Tekshiruvi...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mahsulot nomi</label>
            <input 
              type="text" 
              required
              placeholder="Masalan: Simsiz quloqchinlar"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Narxi</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategoriya</label>
              <select className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all appearance-none">
                <option>Elektronika</option>
                <option>Kiyim-kechak</option>
                <option>Uy-ro'zg'or</option>
                <option>Go'zallik</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tavsif</label>
            <textarea 
              rows={4}
              required
              placeholder="Mahsulot haqida batafsil..."
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all resize-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isAnalyzing}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Tekshirilmoqda...
            </>
          ) : (
            "E'lonni joylash"
          )}
        </button>
      </form>
      
      {/* Safety Info Modal Simulation */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-xl shadow-xl z-50 flex items-start gap-3"
          >
            <ShieldCheck className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-sm">AI Moderatsiya</h4>
              <p className="text-xs text-gray-300 mt-1">
                Rasm tarkibi tekshirilmoqda: 18+ kontent, zo'ravonlik va taqiqlangan belgilar tahlil qilinmoqda.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
