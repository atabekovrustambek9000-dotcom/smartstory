import { useState, useEffect } from "react";
import { Link } from "wouter";
import { User, Settings, Package, Plus, CreditCard, LogOut, ChevronRight, Store, Crown, AlertCircle, Heart, Bell, ClipboardList, Globe, Clock, CheckCircle2, XCircle, Moon, Sun, Shield, MessageCircle } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-store";
import { useAdminStore } from "@/lib/admin-store";
import { useShopStore } from "@/lib/shop-store";
import { useUserStore } from "@/lib/user-store";

export default function Profile() {
  const [isSeller, setIsSeller] = useState(false); // Local toggle for view mode
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { name, phone: userPhone, logout } = useUserStore();
  
  // Stores
  const pendingCount = useAdminStore(state => state.pendingCount());
  const { shopName, description, phone, setShopInfo, listingsUsed, listingsLimit } = useShopStore();

  const hasBoughtPackage = listingsLimit > 10;

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast({
      description: "Seller profile updated!",
    });
  };

  const toggleLanguage = () => {
    const newLang = language === 'uz' ? 'ru' : 'uz';
    setLanguage(newLang);
    toast({
      description: newLang === 'uz' ? "Til O'zbekchaga o'zgardi" : "Язык изменен на Русский",
      duration: 1000,
    });
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
      toast({ description: "Kunduzgi rejim yoqildi" });
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
      toast({ description: "Tungi rejim yoqildi" });
    }
  };

  const displayName = name || "Foydalanuvchi";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300">
      <div className="bg-primary/5 backdrop-blur-sm pb-8 pt-12 px-6 rounded-b-[2rem]">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-primary relative backdrop-blur-md">
            {initials}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-background rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold">{displayName}</h2>
          <p className="text-muted-foreground text-sm">{userPhone}</p>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        
        {/* Admin Link (Only for Admin) */}
        <Link href="/admin">
          <div className="bg-gradient-to-r from-blue-600/90 to-blue-800/90 backdrop-blur-md p-4 rounded-2xl shadow-lg mb-4 flex items-center justify-between cursor-pointer text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Admin Panel</h3>
                <p className="text-xs text-blue-200">To'lovlarni boshqarish</p>
              </div>
            </div>
            {pendingCount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                {pendingCount} yangi
              </div>
            )}
          </div>
        </Link>
        
        {/* Settings Grid */}
        <div className="grid grid-cols-2 gap-4">
           {/* Language Switcher */}
          <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between gap-3 cursor-pointer" onClick={toggleLanguage}>
            <div className="p-2 bg-blue-100/50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-lg w-fit">
              <Globe size={20} />
            </div>
            <div>
              <span className="font-semibold text-sm block">Language / Til</span>
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className={language === 'uz' ? 'text-primary font-bold' : 'text-muted-foreground'}>UZ</span>
                <span className="text-muted-foreground/30">|</span>
                <span className={language === 'ru' ? 'text-primary font-bold' : 'text-muted-foreground'}>RU</span>
              </div>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between gap-3 cursor-pointer" onClick={toggleTheme}>
            <div className={`p-2 rounded-lg w-fit transition-colors ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-yellow-100 text-yellow-600'}`}>
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <span className="font-semibold text-sm block">Theme</span>
              <span className="text-xs text-muted-foreground mt-1">{isDarkMode ? "Tungi rejim" : "Kunduzgi rejim"}</span>
            </div>
          </div>
        </div>

        {/* User Actions - Always Visible */}
        <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border shadow-sm space-y-1">
          <Link href="/orders">
            <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-blue-600" />
                <span className="font-medium">{t('my_orders')}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </Link>

          <Link href="/wishlist">
            <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Heart size={18} className="text-red-500" />
                <span className="font-medium">Wishlist</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </Link>

          <Link href="/notifications">
            <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-orange-500" />
                <span className="font-medium">{t('notifications')}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </Link>
        </div>

        {/* Mode Switcher */}
        <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Store size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{t('seller_mode')}</span>
              <span className="text-xs text-muted-foreground">Manage your shop</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isSeller}
              onChange={() => setIsSeller(!isSeller)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {isSeller && (
          <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
            
            {/* Subscription Status Card */}
            <div className={`p-5 rounded-2xl shadow-lg relative overflow-hidden border backdrop-blur-md ${hasBoughtPackage ? 'bg-gradient-to-br from-green-600/90 to-emerald-700/90 border-green-500' : 'bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700'} text-white`}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Package size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{hasBoughtPackage ? 'Paket Faol' : 'Bepul Limit'}</h3>
                    <p className={`${hasBoughtPackage ? 'text-green-100' : 'text-gray-400'} text-xs`}>
                      {hasBoughtPackage ? 'Qo\'shimcha paket aktivlashtirilgan' : 'Boshlang\'ich bepul limit'}
                    </p>
                  </div>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">Active</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className={hasBoughtPackage ? 'text-green-100' : 'text-gray-300'}>E'lonlar limiti</span>
                    <span className="font-bold">{listingsUsed} / {listingsLimit}</span>
                  </div>
                  <div className={`h-2 ${hasBoughtPackage ? 'bg-green-900/40' : 'bg-gray-700'} rounded-full overflow-hidden`}>
                    <div 
                      className={`h-full ${hasBoughtPackage ? 'bg-white' : 'bg-primary'} transition-all duration-500`} 
                      style={{ width: `${Math.min((listingsUsed / listingsLimit) * 100, 100)}%` }} 
                    />
                  </div>
                  <p className={`text-[10px] ${hasBoughtPackage ? 'text-green-100' : 'text-gray-400'}`}>
                    {listingsLimit - listingsUsed > 0 
                      ? `Sizda yana ${listingsLimit - listingsUsed} ta e'lon joyi bor.` 
                      : "Limit tugadi. Yangi paket sotib oling."}
                  </p>
                </div>

                {/* Always show Upgrade button to buy more packages */}
                <Link href="/premium">
                  <button className="w-full bg-white text-black py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} />
                    E'lonlar sotib olish
                  </button>
                </Link>
              </div>
            </div>

            {/* Seller Details */}
            <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Shop Info</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-primary font-medium"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Shop Name</label>
                    <input 
                      value={shopName}
                      onChange={(e) => setShopInfo({ shopName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-transparent focus:border-primary outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setShopInfo({ description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-transparent focus:border-primary outline-none text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Phone Number</label>
                    <input 
                      value={phone}
                      onChange={(e) => setShopInfo({ phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-transparent focus:border-primary outline-none text-sm"
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium mt-2">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Shop Name</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{shopName}</p>
                      {hasBoughtPackage && (
                        <div className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 size={10} fill="currentColor" /> VERIFIED
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-sm">{description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="font-medium">{phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Seller Actions */}
            <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border shadow-sm space-y-1">
              <Link href="/add-product">
                <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Plus size={16} />
                    </div>
                    <span className="font-medium">Add New Product</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </Link>

              <Link href={`/seller/${shopName}`}>
                <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Package size={16} />
                    </div>
                    <span className="font-medium">My Products</span>
                  </div>
                  <span className="text-xs font-bold bg-secondary px-2 py-1 rounded-md">
                    {listingsUsed} / {listingsLimit}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        )}

        <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border shadow-sm space-y-1">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wider px-2">{t('settings')}</h3>
          
          <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-muted-foreground" />
              <span className="font-medium">General Settings</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors text-destructive" onClick={logout}>
            <div className="flex items-center gap-3">
              <LogOut size={18} />
              <span className="font-medium">{t('log_out')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
