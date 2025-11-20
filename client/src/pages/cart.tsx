import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/cart-store";
import BottomNav from "@/components/bottom-nav";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, incrementQuantity, decrementQuantity, removeFromCart, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const cartTotal = total();

  const handleCheckout = () => {
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase.",
    });
    clearCart();
    setTimeout(() => setLocation("/"), 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center pb-20">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Trash2 className="text-muted-foreground w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 text-sm">Looks like you haven't added anything yet.</p>
        <Link href="/">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg shadow-primary/25 active:scale-95 transition-all">
            Start Shopping
          </button>
        </Link>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center">
        <h1 className="text-lg font-bold mx-auto">My Cart</h1>
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
      <div className="fixed bottom-[64px] left-0 right-0 p-4 bg-background/90 backdrop-blur-lg border-t border-border max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground font-medium">Total</span>
          <span className="text-xl font-bold">${cartTotal}</span>
        </div>
        <button 
          onClick={handleCheckout}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
        >
          Checkout
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
