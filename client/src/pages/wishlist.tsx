import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlist();
  const addToCart = useCart((state) => state.addToCart);
  const { toast } = useToast();

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    toggleWishlist(product); // Remove from wishlist
    toast({
      description: "Savatchaga o'tkazildi",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-4">
        <Link href="/profile">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-lg font-bold">My Wishlist</h1>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center pt-20">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
            <Heart className="text-muted-foreground w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold mb-2">Wishlist is empty</h2>
          <p className="text-muted-foreground mb-8 text-sm">Save items you love for later.</p>
          <Link href="/">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg shadow-primary/25 active:scale-95 transition-all">
              Explore Products
            </button>
          </Link>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-4">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 group"
              >
                <div className="aspect-square relative bg-gray-100 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="object-cover w-full h-full"
                  />
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all text-red-500"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-1">{product.name}</h3>
                  <div className="text-primary font-bold text-sm mb-3">${product.price}</div>
                  
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingBag size={14} />
                    Savatchaga qo'shish
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
