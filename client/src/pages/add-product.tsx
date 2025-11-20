import { ArrowLeft, Upload, DollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AddProduct() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product Added!",
      description: "Your product is now under review.",
      duration: 2000,
    });
    setTimeout(() => setLocation("/profile"), 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-4">
        <Link href="/profile">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-lg font-bold">Add Product</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Image</label>
          <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center mb-2">
              <Upload size={20} className="text-primary" />
            </div>
            <span className="text-xs font-medium">Tap to upload image</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Wireless Headphones"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all appearance-none">
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Home</option>
                <option>Beauty</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              rows={4}
              required
              placeholder="Describe your product..."
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none transition-all resize-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all mt-4"
        >
          Publish Product
        </button>
      </form>
    </div>
  );
}
