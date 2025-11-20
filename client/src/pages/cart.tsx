import { ArrowLeft, Minus, Plus, Trash2, X, Send, CreditCard, Store, MessageCircle, Banknote, Phone, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/cart-store";
import BottomNav from "@/components/bottom-nav";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { products } from "@/lib/data";

export default function Cart() {
  const { items, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  
  // Get bot username from Admin Store
  const botUsername = useAdminStore(state => state.botConfig.username);

  // Mock User Info
  const [formData, setFormData] = useState({
    name: "John Doe",
    phone: "+998 90 123 45 67",
    address: ""
  });

  // Group items by seller
  const itemsBySeller = items.reduce((acc, item) => {
    // Find seller info from products data if not in item
    const productInfo = products.find(p => p.id === item.id);
    const sellerName = productInfo?.sellerName || "Unknown Seller";
    const sellerTelegram = productInfo?.sellerTelegram || botUsername || "yangiyer_smart_bot";
    
    if (!acc[sellerName]) {
      acc[sellerName] = {
        items: [],
        total: 0,
        telegram: sellerTelegram
      };
    }
    acc[sellerName].items.push(item);
    acc[sellerName].total += item.price * item.quantity;
    return acc;
  }, {} as Record<string, { items: typeof items, total: number, telegram: string }>);

  const handleCheckout = (sellerName: string) => {
    setSelectedSeller(sellerName);
    setIsCheckoutOpen(true);
  };

  const confirmOrder = () => {
    if (!selectedSeller) return;
    
    const sellerData = itemsBySeller[selectedSeller];
    const orderItems = sellerData.items.map(i => `- ${i.name} x${i.quantity} ($${i.price * i.quantity})`).join('\n');
    
    const message = `📦 *Yangi Buyurtma (${selectedSeller})*\n\n👤 Mijoz: ${formData.name}\n📞 Tel: ${formData.phone}\n📍 Manzil: ${formData.address || "Kiritilmagan"}\n\n💳 *To'lov: Kelishilgan holda*\n(Telegram yoki telefon orqali)\n\n🛒 *Mahsulotlar:*\n${orderItems}\n\n💰 *Jami: $${sellerData.total}*`;
    
    const encodedMessage = encodeURIComponent(message);
    const target = sellerData.telegram;
    
    window.open(`https://t.me/${target}?start=order_${Date.now()}`, '_blank');
    
    toast({
      title: "Buyurtma yuborildi!",
      description: "Sotuvchi tez orada aloqaga chiqadi.",
    });
    
    // Only remove items from this seller
    sellerData.items.forEach(item => removeFromCart(item.id));
    
    setIsCheckoutOpen(false);
    
    if (items.length === sellerData.items.length) {
        setTimeout(() => setLocation("/"), 1000);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center pb-20">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Trash2 className="text-muted-foreground w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold mb-2">Savatcha bo'sh</h2>
        <p className="text-muted-foreground mb-8 text-sm">Hali hech narsa qo'shmagansiz.</p>
        <Link href="/">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg shadow-primary/25 active:scale-95 transition-all">
            Xaridni boshlash
          </button>
        </Link>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center">
        <h1 className="text-lg font-bold mx-auto">Savatcha</h1>
      </header>

      <div className="p-4 flex flex-col gap-6">
        {Object.entries(itemsBySeller).map(([sellerName, data]) => (
          <div key={sellerName} className="space-y-3">
            <Link href={`/seller/${encodeURIComponent(sellerName)}`}>
              <div className="flex items-center justify-between px-1 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-2">
                  <Store size={18} className="text-primary" />
                  <h2 className="font-bold text-lg">{sellerName}</h2>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </Link>
            
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <AnimatePresence mode="popLayout">
                {data.items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-4 p-3 border-b border-border/50 last:border-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="font-bold text-primary text-sm">${item.price * item.quantity}</div>
                        <div className="flex items-center gap-2 bg-secondary rounded-lg px-1.5 py-0.5">
                          <button 
                            onClick={() => decrementQuantity(item.id)}
                            className="w-5 h-5 flex items-center justify-center bg-background rounded shadow-sm active:scale-90 transition-transform"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-medium w-3 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => incrementQuantity(item.id)}
                            className="w-5 h-5 flex items-center justify-center bg-background rounded shadow-sm active:scale-90 transition-transform"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <div className="p-3 bg-secondary/30 flex justify-between items-center">
                <div>
                  <span className="text-xs text-muted-foreground block">Jami:</span>
                  <span className="text-lg font-bold">${data.total}</span>
                </div>
                <button 
                  onClick={() => handleCheckout(sellerName)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Sotib olish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Modal/Overlay */}
      <AnimatePresence>
        {isCheckoutOpen && selectedSeller && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[2rem] z-50 max-w-md mx-auto shadow-2xl border-t border-border"
            >
              <div className="p-6 pb-10 max-h-[85vh] overflow-y-auto">
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Buyurtmani tasdiqlash</h2>
                    <p className="text-sm text-muted-foreground">Sotuvchi: <span className="font-bold text-primary">{selectedSeller}</span></p>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ismingiz</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefon raqam</label>
                    <input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Manzil (ixtiyoriy)</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Yetkazib berish manzili..."
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none resize-none h-24"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium">To'lov</label>
                    <div className="w-full bg-secondary/30 p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-3 text-primary mb-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                           <Phone size={20} />
                        </div>
                        <div className="font-bold text-sm">Sotuvchi bilan kelishiladi</div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        To'lov turi (Click, Payme yoki Naqd) va yetkazib berish shartlarini sotuvchi bilan Telegram yoki telefon orqali gaplashib olasiz.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">Jami to'lov:</span>
                      <span className="text-xl font-bold text-primary">${itemsBySeller[selectedSeller]?.total || 0}</span>
                    </div>
                    <button 
                      onClick={confirmOrder}
                      className="w-full bg-[#0088cc] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={20} />
                      Telegram orqali yuborish
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
