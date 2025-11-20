import { useState } from "react";
import { Link } from "wouter";
import { User, Settings, Package, Plus, CreditCard, LogOut, ChevronRight, Store } from "lucide-react";
import BottomNav from "@/components/bottom-nav";

export default function Profile() {
  const [isSeller, setIsSeller] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary/5 pb-8 pt-12 px-6 rounded-b-[2rem]">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-primary relative">
            JD
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-background rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold">John Doe</h2>
          <p className="text-muted-foreground text-sm">@johndoe</p>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Mode Switcher */}
        <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Store size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Seller Mode</span>
              <span className="text-xs text-muted-foreground">Manage your shop</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isSeller}
              onChange={() => setIsSeller(!isSeller)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {isSeller && (
          <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm space-y-3 animate-in slide-in-from-top-4 fade-in duration-300">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wider">Seller Dashboard</h3>
            
            <Link href="/add-product">
              <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <span className="font-medium">Add New Product</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </Link>

            <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Package size={16} />
                </div>
                <span className="font-medium">My Products</span>
              </div>
              <span className="text-xs font-bold bg-secondary px-2 py-1 rounded-md">12</span>
            </div>
          </div>
        )}

        <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm space-y-1">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wider px-2">Settings</h3>
          
          <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-muted-foreground" />
              <span className="font-medium">General Settings</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-muted-foreground" />
              <span className="font-medium">Payment Methods</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
          
          <div className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors text-destructive">
            <div className="flex items-center gap-3">
              <LogOut size={18} />
              <span className="font-medium">Log Out</span>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
