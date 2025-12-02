import { useRoute, Link } from "wouter";
import { ArrowLeft, MapPin, Phone, MessageCircle, Star, Store, ShoppingBag } from "lucide-react";
import { useProductStore } from "@/lib/product-store";
import { motion } from "framer-motion";
import BottomNav from "@/components/bottom-nav";

export default function SellerProfile() {
  const [, params] = useRoute("/seller/:name");
  const sellerName = params ? decodeURIComponent(params.name) : "";
  const { products } = useProductStore();
  
  // Get all products for this seller
  const sellerProducts = products.filter(p => p.sellerName === sellerName);
  
  // Get seller info from the first product found (mock data limitation)
  const sellerInfo = sellerProducts[0] || {
    sellerName: sellerName,
    sellerPhone: "N/A",
    sellerTelegram: "yangiyer_smart_bot"
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary/5 pb-6 pt-12 px-6 rounded-b-[2rem] relative">
        <Link href="/">
          <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/50 backdrop-blur flex items-center justify-center hover:bg-white/80 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white text-3xl font-bold text-primary relative">
            {sellerInfo.sellerName.substring(0, 2).toUpperCase()}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <CheckIcon size={12} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{sellerInfo.sellerName}</h1>
          <p className="text-muted-foreground text-sm mb-4 flex items-center gap-1">
            <Store size={14} /> Rasmiy Hamkor
          </p>
          
          <div className="flex gap-3 w-full max-w-xs">
            <button 
              onClick={() => window.open(`https://t.me/${sellerInfo.sellerTelegram}`, '_blank')}
              className="flex-1 bg-[#0088cc] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <MessageCircle size={18} />
              Chat
            </button>
            <button 
              onClick={() => window.open(`tel:${sellerInfo.sellerPhone}`, '_self')}
              className="flex-1 bg-secondary text-foreground py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all border border-border"
            >
              <Phone size={18} />
              Tel
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 px-6 py-6">
        <div className="bg-card p-3 rounded-2xl border border-border shadow-sm text-center">
          <div className="text-xl font-bold text-primary">{sellerProducts.length}</div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold">Mahsulot</div>
        </div>
        <div className="bg-card p-3 rounded-2xl border border-border shadow-sm text-center">
          <div className="text-xl font-bold text-yellow-500 flex items-center justify-center gap-1">
            4.8 <Star size={14} fill="currentColor" />
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold">Reyting</div>
        </div>
        <div className="bg-card p-3 rounded-2xl border border-border shadow-sm text-center">
          <div className="text-xl font-bold text-green-500">98%</div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold">Ijobiy</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4">
        <h3 className="font-bold text-lg mb-4 px-2">Barcha Mahsulotlar</h3>
        
        {sellerProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {sellerProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group cursor-pointer"
                >
                  <div className="aspect-square relative bg-gray-50 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm leading-tight mb-1.5 line-clamp-2 h-9">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-primary font-extrabold">${product.price}</div>
                      <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center text-primary">
                        <ShoppingBag size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>Hozircha mahsulotlar yo'q</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function CheckIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
