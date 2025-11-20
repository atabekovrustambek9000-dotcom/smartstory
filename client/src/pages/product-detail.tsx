import { useRoute, Link } from "wouter";
import { ArrowLeft, ShoppingBag, Star, Share2 } from "lucide-react";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const product = products.find((p) => p.id === id);
  const addToCart = useCart((state) => state.addToCart);
  const { toast } = useToast();

  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      description: "Added to cart",
      duration: 1500,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 relative">
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

        <div className="space-y-4">
          <h3 className="font-semibold">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
        
        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border max-w-md mx-auto">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Add to Cart - ${product.price}
          </button>
        </div>
      </div>
    </div>
  );
}
