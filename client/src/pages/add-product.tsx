import { ArrowLeft, Upload, DollarSign, AlertCircle, ShieldCheck, Loader2, Wand2, Image as ImageIcon, X, Link as LinkIcon, Bell, Send, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddProduct() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState("");
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [notifyUsers, setNotifyUsers] = useState(true); 
  const [productName, setProductName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock limit check
  const listingsUsed = 3;
  const listingsLimit = 10;
  const remaining = listingsLimit - listingsUsed;

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
    
    if (notifyUsers) {
        setTimeout(() => {
            toast({
                title: "Bot Xabarnomasi",
                description: "Mahsulot bot foydalanuvchilariga yuborildi 🚀",
            });
        }, 500);
    }
    
    setTimeout(() => setLocation("/profile"), 1500);
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
          
           {/* Bot Notification Toggle & Preview */}
           <div className="space-y-3">
             <div 
               onClick={() => setNotifyUsers(!notifyUsers)}
               className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${notifyUsers ? 'bg-primary/5 border-primary/30' : 'bg-secondary/30 border-border'}`}
             >
               <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notifyUsers ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                   <Send size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm">Bot orqali yuborish</h4>
                   <p className="text-xs text-muted-foreground">Barcha foydalanuvchilarga xabar boradi</p>
                 </div>
               </div>
               <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${notifyUsers ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                 {notifyUsers && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
               </div>
             </div>

             {/* Telegram Preview */}
             <AnimatePresence>
               {notifyUsers && (
                 <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                 >
                   <div className="bg-[#2A303C] p-3 rounded-xl border border-gray-700 relative max-w-[85%] mx-auto">
                     <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#2A303C] px-2 text-[10px] text-gray-400 font-bold rounded border border-gray-700">Telegram Preview</div>
                     
                     {selectedImage ? (
                        <img src={selectedImage} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                     ) : (
                        <div className="w-full h-32 bg-gray-700 rounded-lg mb-2 flex items-center justify-center text-gray-500 text-xs">Rasm yo'q</div>
                     )}
                     
                     <div className="text-white text-xs mb-2">
                        <b>{productName || "Mahsulot Nomi"}</b>
                        <br />
                        Yangi mahsulot qo'shildi! 🚀
                     </div>

                     <div className="bg-[#3E4856] hover:bg-[#4A5566] transition-colors text-white text-xs font-bold py-2 rounded-lg text-center cursor-pointer flex items-center justify-center gap-1.5">
                       Start Bot 🤖
                     </div>
                   </div>
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
