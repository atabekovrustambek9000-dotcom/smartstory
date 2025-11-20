import { useState } from "react";
import { Link } from "wouter";
import { User, Settings, Package, Plus, CreditCard, LogOut, ChevronRight, Store, Crown, AlertCircle, Heart, Bell, ClipboardList, Globe, Clock, CheckCircle2, XCircle } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-store";

export default function Profile() {
  const [isSeller, setIsSeller] = useState(false);
  const [listingsUsed, setListingsUsed] = useState(3);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  // Mock Seller Data
  const [sellerInfo, setSellerInfo] = useState({
    shopName: "Tech Haven",
    description: "Best gadgets in town!",
    phone: "+998 90 123 45 67"
  });

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary/5 pb-8 pt-12 px-6 rounded-b-[2rem]">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-primary relative">
            JD
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-background rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold">John Doe</h2>
          <p className="text-muted-foreground text-sm">@johndoe</p>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        
        {/* Language Switcher */}
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between" onClick={toggleLanguage}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Globe size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Language / Til</span>
              <span className="text-xs text-muted-foreground">{language === 'uz' ? "O'zbekcha" : "Русский"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer">
            <span className={language === 'uz' ? 'text-primary' : 'text-muted-foreground'}>UZ</span>
            <span className="text-muted-foreground/30">|</span>
            <span className={language === 'ru' ? 'text-primary' : 'text-muted-foreground'}>RU</span>
          </div>
        </div>

        {/* User Actions - Always Visible */}
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-1">
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
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
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
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden border border-gray-700">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Free Plan</h3>
                    <p className="text-gray-400 text-xs">Basic seller account</p>
                  </div>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">Active</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Listings Used</span>
                    <span className="font-bold">{listingsUsed} / 10</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${(listingsUsed / 10) * 100}%` }} 
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">You have {10 - listingsUsed} free listings remaining.</p>
                </div>

                <Link href="/premium">
                  <button className="w-full bg-white text-black py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <Crown size={16} />
                    Upgrade to Premium
                  </button>
                </Link>
              </div>
            </div>

            {/* Seller Details */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
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
                      value={sellerInfo.shopName}
                      onChange={(e) => setSellerInfo({...sellerInfo, shopName: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-transparent focus:border-primary outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Description</label>
                    <textarea 
                      value={sellerInfo.description}
                      onChange={(e) => setSellerInfo({...sellerInfo, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-transparent focus:border-primary outline-none text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Phone Number</label>
                    <input 
                      value={sellerInfo.phone}
                      onChange={(e) => setSellerInfo({...sellerInfo, phone: e.target.value})}
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
                    <p className="font-medium">{sellerInfo.shopName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-sm">{sellerInfo.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="font-medium">{sellerInfo.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Seller Actions */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-1">
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

              {/* My Products with Status */}
              <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Package size={16} />
                  </div>
                  <span className="font-medium">My Products</span>
                </div>
                <div className="flex items-center gap-2">
                   {/* Status indicator simulation */}
                   <div className="flex -space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-background" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500 ring-2 ring-background" />
                   </div>
                   <span className="text-xs font-bold bg-secondary px-2 py-1 rounded-md">{listingsUsed}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-1">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wider px-2">{t('settings')}</h3>
          
          <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-muted-foreground" />
              <span className="font-medium">General Settings</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors text-destructive">
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
