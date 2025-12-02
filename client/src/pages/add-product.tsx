import { ArrowLeft, Upload, DollarSign, AlertCircle, ShieldCheck, Loader2, Wand2, Image as ImageIcon, X, Link as LinkIcon, Bell, Send, Eye, Lock, CreditCard, Plus, Minus, CheckCircle2, History, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/lib/admin-store";
import { useShopStore } from "@/lib/shop-store";

export default function AddProduct() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { listingPrice, isShopPremium } = useAdminStore();
  const { shopName, listingsUsed, listingsLimit, incrementListingsUsed } = useShopStore();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState("");
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [notifyUsers, setNotifyUsers] = useState(true); 
  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState(['Elektronika', 'Kiyim-kechak', "Uy-ro'zg'or", "Go'zallik", "Aksessuarlar", "Bolalar uchun"]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if shop has bought packages (isPremium)
  // If premium, the limit is lifted (or increased)
  const hasPackages = isShopPremium(shopName);
  const isOverLimit = !hasPackages && listingsUsed >= listingsLimit;
  
  // Listing Top-up State
  const [selectedPackage, setSelectedPackage] = useState(10); // 10, 20, 30, 40, 50

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageLink("");
      toast({
        description: "Rasm yuklandi. Endi tahrirlashingiz mumkin.",
      });
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageLink(url);
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || url.includes('tg_image') || url.length > 10) {
        setSelectedImage(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleBlur = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBackgroundBlurred(!isBackgroundBlurred);
    toast({
      description: isBackgroundBlurred ? "Xiralashtirish o'chirildi" : "Orqa fon xiralashtirildi (AI Focus)",
    });
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(null);
    setImageLink("");
    setIsBackgroundBlurred(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "Rasm yuklanmadi",
        description: "Iltimos, mahsulot rasmini yuklang yoki linkini qo'ying.",
      });
      return;
    }

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
    
    // Increment Listings Count
    incrementListingsUsed();

    if (notifyUsers) {
        setTimeout(() => {
            toast({
                title: "Story Tayyorlandi 📸",
                description: "Story joylash oynasi ochilmoqda... Tasdiqlab yuboring.",
                duration: 4000,
            });
            
            // In a real app, this would trigger:
            // window.Telegram.WebApp.shareToStory(mediaUrl, { text: productName, widget_link: { text: "Do'konni ochish", url: shopUrl } });
        }, 500);
    }
    
    setTimeout(() => setLocation("/profile"), 1500);
  };

  // Calculate Price
  const calculatePrice = () => {
    const unitPrice = parseFloat(listingPrice);
    // Price per 10 units
    const multiplier = selectedPackage / 10;
    return (unitPrice * multiplier).toFixed(2);
  };

  // If user is over limit, show payment required screen
  if (isOverLimit) {
    return (
      <div className="min-h-screen bg-background pb-20 relative flex flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-4">
          <Link href="/profile">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-lg font-bold">Limit tugadi</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Lock size={32} />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Bepul limit tugadi</h2>
          <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
            Siz {listingsLimit} ta bepul e'lon joyladingiz. Davom etish uchun qo'shimcha paket sotib oling.
          </p>

          {/* Package Selector */}
          <div className="w-full max-w-xs mb-8">
            <label className="text-xs font-bold text-muted-foreground uppercase mb-3 block tracking-wider">
              Qo'shimcha E'lonlar Soni
            </label>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {[10, 20, 30, 40, 50].map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedPackage(count)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all border-2 ${
                    selectedPackage === count 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105" 
                      : "bg-card border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span>+{count}</span>
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">
                TANLANGAN
              </div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Jami To'lov</p>
              <div className="flex items-end justify-center gap-1 text-primary">
                 <span className="text-4xl font-extrabold tracking-tighter">${calculatePrice()}</span>
                 <span className="text-sm font-bold mb-1.5 opacity-70">USD</span>
              </div>
              <div className="mt-3 text-xs font-medium text-center text-green-600 bg-green-50 py-1.5 px-3 rounded-lg">
                {selectedPackage} ta yangi e'lon qo'shiladi
              </div>
            </div>
          </div>

          <Link href="/premium">
            <button className="w-full max-w-xs bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2">
              <CreditCard size={20} />
              To'lovga o'tish
            </button>
          </Link>
          
          <p className="text-[10px] text-muted-foreground mt-4 max-w-[200px] mx-auto leading-tight">
            To'lov admin tomonidan tasdiqlangandan so'ng limit avtomatik oshiriladi.
          </p>
        </div>
      </div>
    );
  }

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
        {hasPackages ? (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-green-900">Limit oshirilgan</h4>
              <p className="text-xs text-green-700 mt-0.5">
                Siz paket sotib olgansiz. E'lon joylashingiz mumkin.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Bepul e'lonlar limiti</h4>
              <p className="text-xs text-blue-700 mt-0.5">
                Sizda {listingsLimit - listingsUsed} ta bepul e'lon qoldi.
              </p>
            </div>
          </div>
        )}

        {/* Image Upload Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Mahsulot rasmi</label>
            {selectedImage && (
               <button 
                 onClick={toggleBlur}
                 className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-all ${isBackgroundBlurred ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
               >
                 <Wand2 size={12} />
                 {isBackgroundBlurred ? "Xiralikni olish" : "Fonni xiralashtirish"}
               </button>
            )}
          </div>
          
          {/* Toggle Mode */}
          {!selectedImage && (
            <div className="flex bg-secondary/50 p-1 rounded-xl mb-2">
                <button
                    type="button"
                    onClick={() => setUploadMode('file')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${uploadMode === 'file' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                >
                    Galereyadan
                </button>
                <button
                    type="button"
                    onClick={() => setUploadMode('link')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${uploadMode === 'link' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                >
                    Telegram Link
                </button>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload}
          />

          {uploadMode === 'link' && !selectedImage ? (
             <div className="space-y-2">
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                        type="url"
                        value={imageLink}
                        onChange={handleLinkChange}
                        placeholder="https://t.me/kanal/123..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none text-sm"
                    />
                </div>
                <p className="text-[10px] text-muted-foreground pl-1">
                    Telegram kanalingizdagi rasm linkini nusxalab qo'ying.
                </p>
             </div>
          ) : (
              <div 
                onClick={!selectedImage ? triggerFileInput : undefined}
                className={`border-2 border-dashed border-border rounded-2xl h-64 flex flex-col items-center justify-center text-muted-foreground bg-secondary/20 relative overflow-hidden transition-all ${!selectedImage ? 'cursor-pointer hover:bg-secondary/40' : ''}`}
              >
                {selectedImage ? (
                  <>
                    <div className="relative w-full h-full">
                      <img 
                        src={selectedImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      
                      {isBackgroundBlurred && (
                        <div className="absolute inset-0 backdrop-blur-sm" 
                             style={{ 
                               maskImage: "radial-gradient(circle at center, transparent 30%, black 100%)",
                               WebkitMaskImage: "radial-gradient(circle at center, transparent 30%, black 100%)" 
                             }} 
                        />
                      )}
    
                      <button 
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-colors z-20"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-background shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Rasm yuklash</span>
                    <p className="text-xs text-muted-foreground mt-1">Galereyadan tanlash</p>
                  </>
                )}
                
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center z-30"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                      </div>
                      <span className="text-sm font-bold text-primary mt-4">AI Tahlil qilmoqda...</span>
                      <p className="text-xs text-muted-foreground mt-1">Kontent tekshiruvi</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mahsulot nomi</label>
            <input 
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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
              {isCreatingCategory ? (
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Yangi kategoriya nomi..."
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (newCategoryName.trim()) {
                        setCategories([...categories, newCategoryName]);
                        setSelectedCategory(newCategoryName);
                        setNewCategoryName("");
                      }
                      setIsCreatingCategory(false);
                    }}
                    className="bg-primary text-primary-foreground px-4 rounded-xl font-bold text-xs"
                  >
                    OK
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsCreatingCategory(false)}
                    className="bg-secondary text-muted-foreground px-3 rounded-xl"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                   <select 
                    value={selectedCategory}
                    onChange={(e) => {
                      if (e.target.value === 'NEW_CATEGORY') {
                        setIsCreatingCategory(true);
                      } else {
                        setSelectedCategory(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="NEW_CATEGORY" className="font-bold text-primary">+ Yangi kategoriya...</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              )}
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
          
           {/* Bot Notification/Story Toggle & Preview */}
           <div className="space-y-3">
             <div 
               onClick={() => setNotifyUsers(!notifyUsers)}
               className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${notifyUsers ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30' : 'bg-secondary/30 border-border'}`}
             >
               <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notifyUsers ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white' : 'bg-secondary text-muted-foreground'}`}>
                   <History size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm">Kontaktlarga Story joylash</h4>
                   <p className="text-xs text-muted-foreground">"Do'konni ochish" tugmasi bilan</p>
                 </div>
               </div>
               <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${notifyUsers ? 'bg-pink-500 border-pink-500' : 'border-muted-foreground'}`}>
                 {notifyUsers && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
               </div>
             </div>

             {/* Story Preview */}
             <AnimatePresence>
               {notifyUsers && (
                 <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                 >
                   <div className="flex justify-center py-2">
                     <div className="w-[120px] aspect-[9/16] rounded-xl overflow-hidden relative border-2 border-white shadow-lg ring-2 ring-pink-500 ring-offset-2 ring-offset-background">
                        {selectedImage ? (
                          <img src={selectedImage} className="w-full h-full object-cover" alt="Story" />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-[10px]">Rasm yo'q</div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 flex flex-col justify-between p-2">
                           <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-white/20 backdrop-blur-sm"></div>
                              <div className="h-1.5 w-10 bg-white/20 rounded-full backdrop-blur-sm"></div>
                           </div>
                           
                           <div className="text-center">
                              <p className="text-white font-bold text-[8px] line-clamp-2 mb-1 drop-shadow-md">
                                {productName || "Mahsulot Nomi"}
                              </p>
                              <div className="bg-white text-black text-[8px] font-bold py-0.5 px-2 rounded-full inline-block whitespace-nowrap">
                                Do'konni ochish
                              </div>
                           </div>
                        </div>
                     </div>
                   </div>
                   <p className="text-center text-[10px] text-muted-foreground mt-1">
                     Story oldindan ko'rinishi
                   </p>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>

        <button 
          type="submit"
          disabled={isAnalyzing}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            "Tekshirilmoqda..."
          ) : (
            "E'lonni joylash"
          )}
        </button>
      </form>
      
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
                Rasm tahlil qilinmoqda. Ortiqcha detallar va taqiqlangan kontent tekshirilmoqda.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
