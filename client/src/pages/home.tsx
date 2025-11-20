import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, Plus, Heart, Bell, Store, ShoppingBag } from "lucide-react";
import { products, categories } from "@/lib/data";
import BottomNav from "@/components/bottom-nav";
import Stories from "@/components/stories";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-store";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const addToCart = useCart((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
    toast({
      description: t("added_to_cart"),
      duration: 1500,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Store Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 text-white">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            
            {/* Store Name */}
            <div className="flex items-center gap-2">
               <h1 className="text-3xl font-extrabold tracking-tight text-foreground leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Yangiyer
              </h1>
              <span className="text-xs font-bold text-primary tracking-[0.15em] uppercase bg-primary/10 px-2 py-1 rounded-md mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Smart Store
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/notifications">
              <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center relative hover:bg-secondary/80 transition-colors">
                <Bell size={18} className="text-foreground" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
              </button>
            </Link>
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-300 p-[2px] cursor-pointer">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                   <span className="text-primary font-bold text-xs">JD</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search_placeholder")} 
            className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-transparent focus:bg-background focus:border-primary/30 rounded-xl text-sm outline-none transition-all shadow-sm"
          />
        </div>
      </header>

      {/* Stories */}
      <Stories />

      {/* Categories */}
      <div className="py-2 overflow-x-auto hide-scrollbar">
        <div className="flex px-4 gap-2 w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 grid grid-cols-2 gap-4 mt-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isWishlisted = isInWishlist(product.id);
            return (
              <Link key={product.id} href={`/product/${product.id}`}>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group cursor-pointer hover:shadow-md hover:border-primary/20 transition-all relative"
                >
                  <div className="aspect-square relative bg-gray-50 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => handleToggleWishlist(e, product)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/60 backdrop-blur rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all z-10 hover:bg-white"
                    >
                      <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
                    </button>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="absolute bottom-2 right-2 w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center shadow-sm active:scale-90 transition-all text-primary z-10 hover:bg-primary hover:text-white"
                    >
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider bg-primary/5 inline-block px-1.5 rounded">
                      {t(`categories.${product.category}`)}
                    </div>
                    <h3 className="font-bold text-sm leading-tight mb-1.5 line-clamp-2 h-9">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-foreground font-extrabold text-lg">${product.price}</div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                         <Store size={10} />
                         {product.sellerName.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search size={48} className="mb-4 opacity-20" />
            <p>Hozircha mahsulotlar yo'q.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
