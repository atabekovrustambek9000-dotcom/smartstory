import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { products, categories } from "@/lib/data";
import BottomNav from "@/components/bottom-nav";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const addToCart = useCart((state) => state.addToCart);
  const { toast } = useToast();

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // Prevent navigation if clicking the button
    e.stopPropagation();
    addToCart(product);
    toast({
      description: "Added to cart",
      duration: 1500,
    });
  };

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight">Store</h1>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-xs">JD</span>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-9 pr-4 py-2 bg-secondary rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </header>

      {/* Categories */}
      <div className="py-4 overflow-x-auto hide-scrollbar">
        <div className="flex px-4 gap-2 w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="aspect-square relative bg-gray-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all text-primary"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
              <div className="p-3">
                <div className="text-xs text-muted-foreground font-medium mb-1">{product.category}</div>
                <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-1">{product.name}</h3>
                <div className="text-primary font-bold text-sm">${product.price}</div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
