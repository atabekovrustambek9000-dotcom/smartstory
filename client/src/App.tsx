import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Cart from "@/pages/cart";
import ProductDetail from "@/pages/product-detail";
import Profile from "@/pages/profile";
import AddProduct from "@/pages/add-product";
import Premium from "@/pages/premium";
import Wishlist from "@/pages/wishlist";
import Orders from "@/pages/orders";
import Notifications from "@/pages/notifications";
import AdminDashboard from "@/pages/admin";
import BotChat from "@/pages/bot-chat";
import SellerProfile from "@/pages/seller-profile"; // Import SellerProfile
import Bubbles from "@/components/bubbles";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cart" component={Cart} />
      <Route path="/profile" component={Profile} />
      <Route path="/add-product" component={AddProduct} />
      <Route path="/premium" component={Premium} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/orders" component={Orders} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/bot-chat" component={BotChat} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/seller/:name" component={SellerProfile} /> {/* Add Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-background max-w-md mx-auto border-x border-border/40 shadow-2xl relative overflow-hidden">
          <Bubbles />
          <div className="relative z-10">
            <Router />
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
