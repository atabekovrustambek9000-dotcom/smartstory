import { ArrowLeft, Minus, Plus, Trash2, X, Send, CreditCard } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/cart-store";
import BottomNav from "@/components/bottom-nav";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useAdminStore } from "@/lib/admin-store";

export default function Cart() {
  const { items, incrementQuantity, decrementQuantity, removeFromCart, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const cartTotal = total();
  
  // Get bot username from Admin Store
  const botUsername = useAdminStore(state => state.botConfig.username);

  // Mock User Info
  const [formData, setFormData] = useState({
    name: "John Doe",
    phone: "+998 90 123 45 67",
    address: "",
    paymentMethod: "click" as "click" | "payme" | "cash"
  });

  const handleCheckout = () => {
    // Format order for Telegram
    const orderItems = items.map(i => `- ${i.name} x${i.quantity} ($${i.price * i.quantity})`).join('\n');
    const message = `📦 *New Order*\n\n👤 Customer: ${formData.name}\n📞 Phone: ${formData.phone}\n📍 Address: ${formData.address || "Not provided"}\n💳 Payment: ${formData.paymentMethod.toUpperCase()}\n\n🛒 *Items:*\n${orderItems}\n\n💰 *Total: $${cartTotal}*`;
    
    // In a real app, this would send to a backend or bot API
    // For this prototype, we simulate sending to a Telegram bot
    const encodedMessage = encodeURIComponent(message);
    
    // Use the configured bot username
    const targetBot = botUsername || "yangiyer_smart_bot";
    window.open(`https://t.me/${targetBot}?start=order_${Date.now()}`, '_blank');
    
    toast({
      title: "Buyurtma yuborildi!",
      description: "Tez orada operatorlarimiz bog'lanishadi.",
    });
    clearCart();
    setIsCheckoutOpen(false);
    setTimeout(() => setLocation("/"), 1000);
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

      <div className="p-4 flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex gap-4 bg-card p-3 rounded-2xl border border-border shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="font-bold text-primary">${item.price * item.quantity}</div>
                  <div className="flex items-center gap-3 bg-secondary rounded-lg px-2 py-1">
                    <button 
                      onClick={() => decrementQuantity(item.id)}
                      className="w-6 h-6 flex items-center justify-center bg-background rounded-md shadow-sm active:scale-90 transition-transform"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => incrementQuantity(item.id)}
                      className="w-6 h-6 flex items-center justify-center bg-background rounded-md shadow-sm active:scale-90 transition-transform"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Checkout Bar */}
      <div className="fixed bottom-[64px] left-0 right-0 p-4 bg-background/90 backdrop-blur-lg border-t border-border max-w-md mx-auto z-20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground font-medium">Jami</span>
          <span className="text-xl font-bold">${cartTotal}</span>
        </div>
        <button 
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
        >
          Rasmiylashtirish
        </button>
      </div>

      {/* Checkout Modal/Overlay */}
      <AnimatePresence>
        {isCheckoutOpen && (
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
                  <h2 className="text-xl font-bold">Buyurtmani tasdiqlash</h2>
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
                    <label className="text-sm font-medium">To'lov turi</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => setFormData({...formData, paymentMethod: 'click'})}
                        className={`p-3 rounded-xl border text-center text-sm font-medium transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === 'click' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card'}`}
                      >
                        <CreditCard size={20} />
                        Click
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, paymentMethod: 'payme'})}
                        className={`p-3 rounded-xl border text-center text-sm font-medium transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === 'payme' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card'}`}
                      >
                        <CreditCard size={20} />
                        Payme
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                        className={`p-3 rounded-xl border text-center text-sm font-medium transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === 'cash' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card'}`}
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">$</div>
                        Naqd
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">Jami to'lov:</span>
                      <span className="text-xl font-bold text-primary">${cartTotal}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
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
