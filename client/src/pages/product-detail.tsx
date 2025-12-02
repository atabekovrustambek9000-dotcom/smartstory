import { useRoute, Link } from "wouter";
import { ArrowLeft, ShoppingBag, Star, Share2, MessageCircle, Phone, Store, ChevronRight } from "lucide-react";
import { useProductStore } from "@/lib/product-store";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const { products } = useProductStore();
  const product = products.find((p) => p.id === id);
  const addToCart = useCart((state) => state.addToCart);
  const { toast } = useToast();

  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      description: "Savatchaga qo'shildi",
      duration: 1500,
    });
  };

  const handleTelegramMessage = () => {
    const message = encodeURIComponent(`Hello! I'm interested in buying "${product.name}" for $${product.price}. Is it available?`);
    window.open(`https://t.me/${product.sellerTelegram}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-32 relative">
      {/* Header Image */}
      <div className="relative h-[45vh] bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pt-6">
          <Link href="/">
            <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-foreground active:scale-90 transition-all">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-foreground active:scale-90 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-6 rounded-t-3xl bg-background p-6 min-h-[50vh] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
        
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{product.name}</h1>
            <div className="text-muted-foreground text-sm">{product.category}</div>
          </div>
          <div className="text-2xl font-bold text-primary">${product.price}</div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex text-yellow-400">
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" className="text-gray-300" />
          </div>
          <span className="text-sm text-muted-foreground">(4.0)</span>
        </div>

        {/* Seller Info - Now Clickable */}
        <Link href={`/seller/${encodeURIComponent(product.sellerName)}`}>
          <div className="bg-secondary/30 p-4 rounded-2xl mb-6 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors group">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Sold By</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {product.sellerName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm group-hover:text-primary transition-colors">{product.sellerName}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Store size={10} />
                    Official Store
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </div>
          </div>
        </Link>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
        
        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border max-w-md mx-auto z-20">
          <div className="flex gap-3">
            <button 
              onClick={handleTelegramMessage}
              className="flex-1 bg-[#0088cc] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Telegram
            </button>
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Savatchaga qo'shish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
