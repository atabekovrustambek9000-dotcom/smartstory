import { Link, useLocation } from "wouter";
import { Home, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { motion } from "framer-motion";

export default function BottomNav() {
  const [location] = useLocation();
  const items = useCart((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </div>
        </Link>
        
        <Link href="/cart">
          <div className={`flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer relative ${isActive('/cart') ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className="relative">
              <ShoppingBag size={24} strokeWidth={isActive('/cart') ? 2.5 : 2} />
              {cartCount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {cartCount}
                </motion.div>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </div>
        </Link>

        <Link href="/profile">
          <div className={`flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
            <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Profile</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
